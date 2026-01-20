import prisma from "../../../shared/prisma";
import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { calculatePagination } from "../../../halpers/paginationAndSoringHalper";
import { IPaginationOptions } from "../../interfaces/paginationSortFilter";
import { doctorSearchableFields } from "./doctor.constants";
import { IDoctorFilterRequest, IDoctorUpdate } from "./doctor.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { openRouter } from "../../../halpers/openRouter";

const getAllDoctorFromDB = async (filter: IDoctorFilterRequest, options: IPaginationOptions): Promise<Doctor | null> => {
    const { skip, limit, page } = calculatePagination(options);

    const { searchTerm, specialties, ...filterData } = filter

    const andConditions: Prisma.DoctorWhereInput[] = [];

    // fileter soft deleted data
    andConditions.push({
        isDeleted: false
    })

    // SEARCH TERM
    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: 'insensitive'
                        }
                    }
                }
            }
        })
    }

    // DIRECT FIELD FILTERING
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    // FINAL WHERE CONDITION
    const whereCondition: Prisma.DoctorWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    // QUERY
    const result = await prisma.doctor.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });

    const total = await prisma.doctor.count({
        where: whereCondition,
    });

    return {
        meta: {
            total,
            page,
            limit,

        },
        data: result,
    };
};

const getSingleDoctrFromDB = async (id: string): Promise<Doctor | null> => {

    return await prisma.doctor.findUnique({
        where: {
            id
        }
    })

}

const updateDoctorFromDB = async (id: string, payload: IDoctorUpdate): Promise<Doctor | null> => {

    const { specialties, ...doctorData } = payload;

    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: { id },
    });

    await prisma.$transaction(async (tx) => {

        // update doctor main info
        await tx.doctor.update({
            where: { id },
            data: doctorData,
        });

        if (specialties && specialties.length > 0) {

            // DELETE specialties
            const deleteSpecialties = specialties.filter(
                (specialty) => specialty.isDeleted
            );

            for (const specialty of deleteSpecialties) {
                await tx.doctorSpecialty.deleteMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialtysId: specialty.specialtysId
                    },
                });
            }

            // CREATE specialties
            const createSpecialties = specialties.filter(
                (specialty) => !specialty.isDeleted
            );

            for (const specialty of createSpecialties) {
                await tx.doctorSpecialty.create({
                    data: {
                        doctorId: doctorInfo.id,
                        specialtysId: specialty.specialtysId
                    },
                });
            }
        }
    });

    // Return updated doctor with specialties
    const result = await prisma.doctor.findUnique({
        where: { id: doctorInfo.id },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true,
                },
            },
        },
    });

    return result;
};

const deleteDoctrFromDB = async (id: string): Promise<Doctor | null> => {
    return await prisma.$transaction(async transactionClient => {

        const deleteDoctor = await transactionClient.doctor.delete({
            where: {
                id
            }
        })

        await transactionClient.user.delete({
            where: {
                email: deleteDoctor.email
            }
        })
        return deleteDoctor
    })
}

const softDoctrFromDB = async (id: string, status: UserStatus): Promise<Doctor | null> => {

    return await prisma.$transaction(async transactionClient => {

        const deleteDoctor = await transactionClient.doctor.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        })

        await transactionClient.user.update({
            where: {
                email: deleteDoctor.email
            },
            data: {
                status: UserStatus.DELETED
            }
        })
        return deleteDoctor
    })
}

const aiSuggestion = async (payload: { symptom: string }) => {
    if (!(payload && payload.symptom)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Symptom is Required");
    }

    // Fetch doctors from database
    const doctors = await prisma.doctor.findMany({
        where: { isDeleted: false },
        include: { doctorSpecialties: true }
    })

    // Simple and direct prompt
    const prompt = `
    You are a professional Medical Assistant AI.
     Your task is to analyze user symptoms and
     match them with the most relevant doctor
      specialties from the provided list
    Symptom: "${payload.symptom}"
    Task: Recommend suitable doctors. 
    Return ONLY a JSON object with full doctor data list in json:
    ${JSON.stringify(doctors, null, 2)}
    `;

    const completion = await openRouter.chat.send({
        model: 'mistralai/devstral-2512:free',
        messages: [
            {
                role: "system",
                content: "You are a medical assistant. Reply only in JSON."
            },
            {
                role: 'user',
                content: prompt
            },
        ],
        stream: false,
    });

    const rawContent = completion.choices[0].message.content;

    const cleanedContent = rawContent
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim();

    const parsedDoctors = JSON.parse(cleanedContent);

    return parsedDoctors;


};

export const DoctorService = {
    getAllDoctorFromDB,
    getSingleDoctrFromDB,
    updateDoctorFromDB,
    deleteDoctrFromDB,
    softDoctrFromDB,
    aiSuggestion
};
