import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { IAuthUser } from "../../interfaces/common";
import { calculatePagination } from "../../../halpers/paginationAndSoringHalper";


const insertIntoDB = async (user: any, payload: { specialtysIds: string[] }) => {

    // find the doctor by email who get eamil from auth token
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: { email: user.email }
    })
    // make the data 
    const doctorScheduleData = payload.specialtysIds.map(scheduleId => ({
        doctorId: doctorData.id,
        scheduleId
    }))
    const result = await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    })
    return result
};

const getAllSchedulFromDB = async (filters: any, options: any) => {

    const { skip, limit, page } = calculatePagination(options);
    const { serchTerm, ...filterData } = filters

    const andConditions: Prisma.DoctorSchedulesWhereInput[] = []

    if (serchTerm) {
        andConditions.push({
            doctor: {
                name: {
                    contains: serchTerm,
                    mode: "insensitive"
                }
            }
        })
    }

    // DIRECT FIELD FILTERING
    if (Object.keys(filterData).length > 0) {

        if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'true') {
            filterData.isBooked = true;
        } else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false') {
            filterData.isBooked = false;
        }

        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    // FINAL WHERE CONDITION
    const whereCondition: Prisma.DoctorSchedulesWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    // QUERY
    const result = await prisma.doctorSchedules.findMany({
        include: {
            doctor: true,
            schedule: true
        },
        where: whereCondition,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ?
            { [options.sortBy]: options.sortOrder }
            : {}
    });

    const total = await prisma.doctorSchedules.count({
        where: whereCondition
    });

    return {
        meta: {
            total,
            page,
            limit,

        },
        data: result,
    };
}

const getMySchedulFromDB = async (user: IAuthUser, filters: any, options: any) => {

    const { skip, limit, page } = calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters

    const andConditions: Prisma.DoctorSchedulesWhereInput[] = []

    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    schedule: {
                        startDateTime: {
                            gte: startDate
                        }
                    }
                },
                {
                    schedule: {
                        endDateTime: {
                            lte: endDate
                        }
                    }

                }
            ]
        })
    }

    // DIRECT FIELD FILTERING
    if (Object.keys(filterData).length > 0) {
        if (typeof filterData.isBooked === "string" && filterData.isBooked === 'true') {
            filterData.isBooked = true
        }
        else if (typeof filterData.isBooked === "string" && filterData.isBooked === 'false') {
            filterData.isBooked = false
        }
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    // FINAL WHERE CONDITION
    const whereCondition: Prisma.DoctorSchedulesWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};



    // QUERY
    const result = await prisma.doctorSchedules.findMany({
        where: whereCondition,


        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ?
            { [options.sortBy]: options.sortOrder }
            : {

            }
    });

    const total = await prisma.doctorSchedules.count({
        where: whereCondition

    });

    return {
        meta: {
            total,
            page,
            limit,

        },
        data: result,
    };
}

const deleteMySchedulByIdFromDB = async (id: string, user: IAuthUser) => {
    const doctorData = await prisma.doctor.findFirstOrThrow({
        where: {
            email: user?.email
        }
    })
    const isBookedSchedule = await prisma.doctorSchedules.findFirst({
        where: {
            doctorId: doctorData.id,
            scheduleId: id,
            isBooked: true
        }
    })
    if (isBookedSchedule) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can not delete the schedule because of the schedule is already booked!")
    }
    const result = await prisma.doctorSchedules.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: id
            }
        }
    })
    return result
}

export const DoctorScheduleServices = {
    insertIntoDB,
    getMySchedulFromDB,
    getAllSchedulFromDB,
    deleteMySchedulByIdFromDB

};