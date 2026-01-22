import prisma from "../../../shared/prisma";
import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { calculatePagination, IPagination } from "../../../halpers/paginationAndSoringHalper";
import { doctorSearchableFields } from "./doctor.constants";
import { IDoctorFilterRequest, IDoctorUpdate } from "./doctor.interface";
import { IGenericResponse } from "../../interfaces/paginationSortFilter";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { openRouter } from "../../../halpers/openRouter";

const getAllDoctorFromDB = async (
    filter: IDoctorFilterRequest,
    options: IPagination
): Promise<IGenericResponse<Doctor[]>> => {
    const { skip, limit, page } = calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filter;

    const andConditions: Prisma.DoctorWhereInput[] = [{ isDeleted: false }];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map(field => ({
                [field]: { contains: searchTerm, mode: "insensitive" },
            })),
        });
    }

    if (specialties) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: { contains: specialties, mode: "insensitive" },
                    },
                },
            },
        });
    }

    if (Object.keys(filterData).length) {
        andConditions.push({
            AND: Object.entries(filterData).map(([key, value]) => ({
                [key]: { equals: value },
            })),
        });
    }

    const whereCondition: Prisma.DoctorWhereInput = { AND: andConditions };

    const data = await prisma.doctor.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: options.sortBy
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: "desc" },
        include: {
            doctorSpecialties: { include: { specialities: true } },
        },
    });

    const total = await prisma.doctor.count({ where: whereCondition });

    return {
        meta: { total, page, limit },
        data,
    };
};

const getSingleDoctorFromDB = async (id: string): Promise<Doctor | null> => {
    return prisma.doctor.findFirst({
        where: { id, isDeleted: false },
        include: {

            doctorSpecialties: { include: { specialities: true } },
            doctorSchedules: true,
            reviews: true
        },
    });
};

const updateDoctorFromDB = async (
    id: string,
    payload: IDoctorUpdate
): Promise<Doctor | null> => {
    const { specialties, ...doctorData } = payload;

    const doctor = await prisma.doctor.findUniqueOrThrow({ where: { id } });

    await prisma.$transaction(async tx => {
        await tx.doctor.update({ where: { id }, data: doctorData });

        if (specialties?.length) {
            await tx.doctorSpecialty.deleteMany({ where: { doctorId: id } });

            await tx.doctorSpecialty.createMany({
                data: specialties.map(s => ({
                    doctorId: id,
                    specialtysId: s.specialtiesId
                })),
            });
        }
    });

    return prisma.doctor.findUnique({
        where: { id },
        include: { doctorSpecialties: { include: { specialities: true } } },
    });
};

const deleteDoctorFromDB = async (id: string): Promise<Doctor> => {
    return prisma.$transaction(async tx => {
        const doctor = await tx.doctor.delete({ where: { id } });
        await tx.user.delete({ where: { email: doctor.email } });
        return doctor;
    });
};

const softDeleteDoctorFromDB = async (
    id: string,
    status: UserStatus
): Promise<Doctor> => {
    return prisma.$transaction(async tx => {
        const doctor = await tx.doctor.update({
            where: { id },
            data: { isDeleted: true },
        });

        await tx.user.update({
            where: { email: doctor.email },
            data: { status },
        });

        return doctor;
    });
};

const aiSuggestion = async (payload: { symptom: string }) => {
    if (!payload?.symptom) {
        throw new AppError(httpStatus.BAD_REQUEST, "Symptom is required");
    }

    const doctors = await prisma.doctor.findMany({
        where: { isDeleted: false },
        include: { doctorSpecialties: true },
    });

    const completion = await openRouter.chat.send({
        model: "mistralai/devstral-2512:free",
        messages: [
            { role: "system", content: "Reply only in JSON" },
            {
                role: "user",
                content: `Symptom: ${payload.symptom}\nDoctors:\n${JSON.stringify(doctors)}`,
            },
        ],
    });

    return JSON.parse(
        completion?.choices[0]?.message.content?.replace(/```json|```/g, "").trim()
    );
};

export const DoctorService = {
    getAllDoctorFromDB,
    getSingleDoctorFromDB,
    updateDoctorFromDB,
    deleteDoctorFromDB,
    softDeleteDoctorFromDB,
    aiSuggestion,
};
