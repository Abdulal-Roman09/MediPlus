import prisma from "../../../shared/prisma";
import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { calculatePagination } from "../../../halpers/paginationAndSoringHalper";
import { IPaginationOptions } from "../../interfaces/paginationSortFilter";
import { doctorSearchableFields } from "./doctor.constants";
import { IDoctorFilterRequest } from "./doctor.interface";

const getAllDoctorFromDB = async (params: IDoctorFilterRequest, options: IPaginationOptions): Promise<Doctor | null> => {
    const { skip, limit, page, sortBy, sortOrder } = calculatePagination(options);

    const { searchTerm, specialties, ...filterData } = params;

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
                    specialty: {
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
                    specialty: true
                }
            }
        }
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

const getSingleDoctrFromDB = async (id: string): Promise<Doctor | null> => {

    return await prisma.doctor.findUnique({
        where: {
            id
        }
    })

}

const updateDoctorFromDB = async (id: string, payload: any): Promise<Doctor | null> => {
    const { specialties, ...doctorData } = payload;

    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    await prisma.$transaction(async (transactionClient) => {
        await transactionClient.doctor.update({
            where: {
                id
            },
            data: doctorData
        });

        if (specialties && specialties.length > 0) {
            // delete specialties
            const deleteSpecialtiesIds = specialties.filter(specialty => specialty.isDeleted);
            //console.log(deleteSpecialtiesIds)
            for (const specialty of deleteSpecialtiesIds) {
                await transactionClient.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialitiesId: specialty.specialtiesId
                    }
                });
            }

            // create specialties
            const createSpecialtiesIds = specialties.filter(specialty => !specialty.isDeleted);
            console.log(createSpecialtiesIds)
            for (const specialty of createSpecialtiesIds) {
                await transactionClient.doctorSpecialties.create({
                    data: {
                        doctorId: doctorInfo.id,
                        specialitiesId: specialty.specialtiesId
                    }
                });
            }
        }
    })

    const result = await prisma.doctor.findUnique({
        where: {
            id: doctorInfo.id
        },
        include: {
            doctorSpecialties: {
                include: {
                    specilites: true
                }
            }
        }
    })
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

export const DoctorService = {
    getAllDoctorFromDB,
    getSingleDoctrFromDB,
    updateDoctorFromDB,
    deleteDoctrFromDB,
    softDoctrFromDB
};
