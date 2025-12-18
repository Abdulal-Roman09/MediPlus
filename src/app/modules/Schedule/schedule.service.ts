import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { ISchedule } from "./schedule.interface";
import { Prisma, Schedule } from "@prisma/client";
import { calculatePagination } from "../../../halpers/paginationAndSoringHalper";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDB = async (payload: ISchedule): Promise<Schedule[]> => {
    const { startDate, endDate, startTime, endTime } = payload;
    console.log(payload)
    const interverlTime = 30;
    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate)


    while (currentDate <= lastDate) {

        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(startTime.split(':')[0])
                ),
                Number(startTime.split(':')[1])
            )
        );

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(endTime.split(':')[0])
                ),
                Number(endTime.split(':')[1])
            )
        );

        while (startDateTime < endDateTime) {
            const scheduleDate = {
                startDateTime,
                endDateTime: addMinutes(startDateTime, interverlTime)
            }
            console.log(scheduleDate)
            const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleDate.startDateTime,
                    endDateTime: scheduleDate.endDateTime
                }
            })
            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleDate
                })
                schedules.push(result)
            }
            startDateTime.setMinutes(startDateTime.getMinutes() + interverlTime)
        }
        currentDate.setDate(currentDate.getDate() + 1)
    }
    return schedules
};

const getAllSchedulFromDB = async (user: IAuthUser, filters: any, options: any) => {

    const { skip, limit, page } = calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters

    const andConditions: Prisma.ScheduleWhereInput[] = []

    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: startDate
                    }
                },
                {
                    endDateTime: {
                        lte: endDate
                    }

                }
            ]
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
    const whereCondition: Prisma.ScheduleWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user?.email
            }
        }
    })
    const doctorScheduleIds = await doctorSchedules.map(schedule => schedule.scheduleId)

    // QUERY
    const result = await prisma.schedule.findMany({
        where: {
            ...whereCondition,
            id: {
                notIn: doctorScheduleIds
            }
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ?
            { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' }
    });

    const total = await prisma.schedule.count({
        where: {
            ...whereCondition,
            id: {
                notIn: doctorScheduleIds
            }
        }
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

const getSchedulByIdFromDB = async (id: string) => {
    const result = await prisma.schedule.findUnique({
        where: { id }
    })
    return result
}

export const ScheduleServices = {
    insertIntoDB,
    getAllSchedulFromDB,
    getSchedulByIdFromDB
};