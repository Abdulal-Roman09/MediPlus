import { Request } from "express";
import { IAuthUser } from "../../interfaces/common";
import { endOfMonth, startOfMonth, format, eachMonthOfInterval, subMonths } from "date-fns";
import prisma from "../../../shared/prisma";


const patientCount = async (user: IAuthUser, period: number) => {

    const doctorData = await prisma.doctor.findUnique({
        where: {
            email: user?.email
        }
    })
    const now = new Date();

    if (period === 1) {
        const startDate = startOfMonth(now);
        const endDate = endOfMonth(now);

        // Fetch appointments with only patientId
        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId: doctorData?.id,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                patientId: true,
            },
        });

        // Calculate unique patients using Set
        const uniquePatients = new Set(appointments.map((app) => app.patientId));
        return { thisMonth: uniquePatients.size };
    }
    else if ([3, 6, 12].includes(period)) {
        const monthsAgo = subMonths(now, period - 1);
        const startDate = startOfMonth(monthsAgo);
        const endDate = endOfMonth(now);

        // Fetch appointments with patientId and createdAt
        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId: doctorData?.id,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                patientId: true,
                createdAt: true,
            },
        });

        const monthlyData = new Map<string, Set<string>>();

        appointments.forEach((app) => {
            const monthKey = format(app.createdAt, 'yyyy-MM');
            if (!monthlyData.has(monthKey)) {
                monthlyData.set(monthKey, new Set());
            }
            monthlyData.get(monthKey)!.add(app.patientId);
        });

        // Get all months in the interval to include zeros if needed
        const allMonths = eachMonthOfInterval({ start: startDate, end: endDate }).map((date) =>
            format(date, 'yyyy-MM')
        );

        // Format the data: [{ month: 'Jul', count: 20 }, ...]
        const periodMonthsData = allMonths.map((monthKey) => ({
            month: format(new Date(monthKey + '-01'), 'MMM'),
            count: monthlyData.get(monthKey)?.size || 0,
        }));

        return { periodMonths: periodMonthsData };
    } else {
        throw new Error('Invalid period. Must be 1, 3, 6, or 12');
    }

}


export const StatisticsServices = {
    patientCount

}