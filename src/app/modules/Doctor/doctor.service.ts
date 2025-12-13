import prisma from "../../../shared/prisma";
import { Prisma } from "@prisma/client";
import { calculatePagination } from "../../../halpers/paginationAndSoringHalper";
import { IPaginationOptions } from "../../interfaces/paginationSortFilter";
import { doctorSearchableFields } from "./doctor.constants";
import { IDoctorFilterRequest } from "./doctor.interface";

const getAllAdminFromDB = async (
    params: IDoctorFilterRequest,
    options: IPaginationOptions
) => {
    const { skip, limit, page, sortBy, sortOrder } = calculatePagination(options);

    const { searchTerm, ...filterData } = params;

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
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    const total = await prisma.doctor.count({
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

const getSingleDoctrFromDB = async (id: string) => {

    await prisma.doctor.findUnique({
        where: {
            id
        }
    })
    const result = await prisma.doctor.delete({
        where: {
            id
        }
    })
    return result
}


export const DoctorService = {
    getAllAdminFromDB,
    getSingleDoctrFromDB
};
