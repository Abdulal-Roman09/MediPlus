import { Prisma } from "@prisma/client";
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

    const isBookedSchedule = await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: doctorData.id,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    })
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

    })
return result

};



export const AppoinmentServices = {
    createAppoinment

};