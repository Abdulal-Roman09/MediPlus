import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { ISchedule } from "./schedule.interface";
import { Schedule } from "@prisma/client";

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

export const ScheduleServices = {
    insertIntoDB,
};