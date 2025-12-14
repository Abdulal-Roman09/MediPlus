import prisma from "../../../shared/prisma";
import { calculatePagination } from "../../../halpers/paginationAndSoringHalper";
import { IPaginationOptions } from "../../interfaces/paginationSortFilter";
import { patientSearchAbleFields } from "./patient.contance";
import { Prisma, UserStatus } from "@prisma/client";

const getAllPatientFromDB = async (params: any, options: IPaginationOptions) => {
    const { skip, limit, page, } = calculatePagination(options);

    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.PatientWhereInput[] = [];

    // fileter soft deleted data
    andConditions.push({
        isDeleted: false
    })

    // SEARCH TERM
    if (searchTerm) {
        andConditions.push({
            OR: patientSearchAbleFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
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
    const whereCondition: Prisma.PatientWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    // QUERY
    const result = await prisma.patient.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: {
            medicalReports: true,
            patientHealthData: true
        }
    });

    const total = await prisma.patient.count({
        where: whereCondition,
    });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getSinglePatientFromDB = async (id: string) => {
    const result = await prisma.patient.findUnique({
        where: {
            id,
            isDeleted: false
        },
        include: {
            medicalReports: true,
            patientHealthData: true
        }
    })
    return result
}

const softDeletePatientFromDB = async (id: string) => {
    return await prisma.$transaction(async tx => {
        const deletePatient = await tx.patient.update({
            where: { id },
            data: {
                isDeleted: true
            }
        })
        await tx.user.update({
            where: {
                email: deletePatient.email
            },
            data: {
                status: UserStatus.DELETED
            }
        })
        return deletePatient
    })

}


export const PatientService = {
    getAllPatientFromDB,
    getSinglePatientFromDB,
    softDeletePatientFromDB
};
