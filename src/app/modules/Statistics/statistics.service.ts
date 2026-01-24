import httpStatus from 'http-status'
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { IAuthUser } from "../../interfaces/common";
import { PaymentStatus, UserRole } from "@prisma/client";
import { endOfMonth, startOfMonth, format, eachMonthOfInterval, subMonths } from "date-fns";


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

const dashboardMetaData = async (user: IAuthUser) => {
    let metaData;

    switch (user?.role) {
        case UserRole.ADMIN:
            metaData = "Admin metadata"
            break
        case UserRole.DOCTOR:
            metaData = "doctor metaData"
            break
        case UserRole.PATIENT:
            metaData = "patient meta data"
            break
        default:
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid user role")
    }
    return metaData

}

const getAdminMetaData = async () => {
    const patientCount = await prisma.patient.count()
    const doctorCount = await prisma.doctor.count()
    const adminCount = await prisma.admin.count()
    const appointmentCount = await prisma.appointment.count()
    const paymentCount = await prisma.payment.count()

    const totalReviewnaw = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: PaymentStatus.PAID
        }
    })
}

const getBarChartData = async () => {
    const appointmentCountPerMounth = await prisma.$queryRaw`
    SELECT DATE_TRUNC('mounth',"createdAt") as month
    CAST (COUNT (*) AS INTEGER) AS count
    FROM "appointments"
    GROPE BY mounth
    ORDER BY mounth ASC
    `

    return appointmentCountPerMounth
}


export const StatisticsServices = {
    patientCount,
    dashboardMetaData,
    getBarChartData,
    getAdminMetaData

}