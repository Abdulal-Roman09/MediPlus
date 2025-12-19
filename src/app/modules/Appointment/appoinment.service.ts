import { Prisma, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { calculatePagination } from "../../../halpers/paginationAndSoringHalper";
import { IAuthUser } from "../../interfaces/common";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { v4 as uuidv4 } from 'uuid';


const createAppoinment = async (user: IAuthUser, payload: any) => {

    const patientData = await prisma.patient.findFirstOrThrow({
        where: {
            email: user?.email
        }
    })

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId
        }
    })

    const isBookedSchedule = await prisma.doctorSchedules.findFirst({
        where: {
            doctorId: doctorData.id,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    })

    if (!isBookedSchedule) {
        throw new AppError(httpStatus.BAD_REQUEST, "Schedule already booked");
    }

    const videoCallingId: string = uuidv4();

    const result = await prisma.$transaction(async (tx) => {

        const appoinmentData = await tx.appointment.create({
            data: {
                patientId: patientData.id,
                doctorId: doctorData.id,
                scheduleId: payload.scheduleId,
                videoCallingId
            },
            include: {
                patient: true,
                doctor: true,
                schedule: true,
            }
        })

        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true,
                appointmentId: appoinmentData.id
            }
        })
        // payment
        const today = new Date()
        const transactionId = "Medicare-" + today.getFullYear() + "-" + today.getMonth() + "-"
            + today.getDay() + "-" + today.getHours() + "-" + today.getMinutes();

        await tx.payment.create({
            data: {
                appointmentId: appoinmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        })
        return appoinmentData
    })
    return result

};

const getMyAppoinmentFromDB = async (user: IAuthUser, filters: any, options: any) => {

    const { skip, limit, page } = calculatePagination(options);
    const { ...filterData } = filters

    const andConditions: Prisma.AppointmentWhereInput[] = []

    // DIRECT FIELD FILTERING
    if (Object.keys(filterData).length > 0) {
        if (user?.role === UserRole.PATIENT) {
            andConditions.push({
                patient: {
                    email: user?.email
                }
            })
        }
        else if (user?.role === UserRole.DOCTOR) {
            andConditions.push({
                doctor: {
                    email: user?.email
                }
            })
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
    const whereCondition: Prisma.AppointmentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    // QUERY
    const result = await prisma.appointment.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ?
            { [options.sortBy]: options.sortOrder }
            : {},
        include: user?.role === UserRole.PATIENT ?
            { doctor: true, schedule: true } :
            {
                patient: {
                    include: {
                        medicalReports: true,
                        patientHealthData: true
                    }
                }
            }
    });

    const total = await prisma.appointment.count({
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

const getAllAppoinmentFromDB = async (user: IAuthUser, filters: any, options: any) => {

    const { skip, limit, page } = calculatePagination(options);
    const { patientEmail, doctorEmail, ...filterData } = filters

    const andConditions: Prisma.AppointmentWhereInput[] = []
    if (patientEmail) {
        andConditions.push({
            patient: {
                email: patientEmail
            }
        })
    }
    else if (patientEmail) {
        andConditions.push({
            doctor: {
                email: patientEmail
            }
        })
    }

    // DIRECT FIELD FILTERING
    if (Object.keys(filterData).length > 0) {
        if (user?.role === UserRole.PATIENT) {
            andConditions.push({
                patient: {
                    email: user?.email
                }
            })
        }
        else if (user?.role === UserRole.DOCTOR) {
            andConditions.push({
                doctor: {
                    email: user?.email
                }
            })
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
    const whereCondition: Prisma.AppointmentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    // QUERY
    const result = await prisma.appointment.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ?
            { [options.sortBy]: options.sortOrder }
            : {},
        include: {
            doctor: true,
            patient: true
        }
    });

    const total = await prisma.appointment.count({
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

export const AppoinmentServices = {
    createAppoinment,
    getAllAppoinmentFromDB,
    getMyAppoinmentFromDB

};