import { v4 as uuidv4 } from 'uuid';
import prisma from "../../../shared/prisma";
import { stripe } from "../../../halpers/stripe";
import { AppointmentStatus, PaymentStatus, Prisma, UserRole } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common";
import { calculatePagination } from "../../../halpers/paginationAndSoringHalper";
import AppError from '../../errors/AppError';
import httpStatus from 'http-status'

export const createAppointment = async (user: IAuthUser, payload: any) => {
    const patientData = await prisma.patient.findFirstOrThrow({
        where: { email: user?.email },
    });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false,
        },
    });

    const isBookedOrNot = await prisma.doctorSchedules.findFirst({
        where: {
            doctorId: doctorData.id,
            scheduleId: payload.scheduleId,
            isBooked: false,
        },
    });

    if (!isBookedOrNot) {
        throw new Error("Schedule already booked");
    }

    const videoCallingId = uuidv4();

    const result = await prisma.$transaction(async (tx) => {
        const appointmentData = await tx.appointment.create({
            data: {
                patientId: patientData.id,
                doctorId: doctorData.id,
                scheduleId: payload.scheduleId,
                videoCallingId,
            },
        });

        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId,
                },
            },
            data: {
                isBooked: true,
            },
        });

        const today = new Date();
        const transactionId = `Medicare-(${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()})-${uuidv4()}`;

        const paymentData = await tx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId,
            },
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: user?.email,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Appointment with Dr. ${doctorData.name}`,
                        },
                        unit_amount: doctorData.appointmentFee * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                appointmentId: appointmentData.id,
                paymentId: paymentData.id,
            },
            success_url: `https://www.programming-hero.com/`,
            cancel_url: `https://next.programming-hero.com/`

        });

        return {
            paymentUrl: session.url,
        };
    });

    return result;
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

const updateAppoinmentStatus = async (appoinmentId: string, status: AppointmentStatus, user: IAuthUser) => {

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: appoinmentId
        },
        include: {
            doctor: true
        }
    })

    if (user?.role) {
        if (user.email === appointmentData.doctor.email) {
            throw new AppError(httpStatus.BAD_REQUEST, "This is not Your Appintment")
        }
    }

    const result = await prisma.appointment.update({
        where: {
            id: appoinmentId
        },
        data: {
            status
        }
    })
    return result
}

const cancelUnpaidAppointments = async () => {

    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);

    const unpaidAppointments = await prisma.appointment.findMany({
        where: {
            createdAt: {
                lte: thirtyMinAgo,
            },
            paymentStatus: PaymentStatus.UNPAID,
        },
    });

    if (!unpaidAppointments.length) return;

    const appointmentIds = unpaidAppointments.map(a => a.id);

    await prisma.$transaction(async (tx) => {

        for (const appointment of unpaidAppointments) {
            await tx.doctorSchedules.update({
                where: {
                    doctorId_scheduleId: {
                        doctorId: appointment.doctorId,
                        scheduleId: appointment.scheduleId,
                    },
                },
                data: {
                    isBooked: false,
                },
            });
        }

        await tx.payment.deleteMany({
            where: {
                appointmentId: {
                    in: appointmentIds,
                },
            },
        });

        await tx.appointment.deleteMany({
            where: {
                id: {
                    in: appointmentIds,
                },
            },
        });
    });
};


export const AppoinmentServices = {
    createAppointment,
    getAllAppoinmentFromDB,
    getMyAppoinmentFromDB,
    updateAppoinmentStatus,
    cancelUnpaidAppointments

};