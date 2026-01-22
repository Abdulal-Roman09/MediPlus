import httpStatus from 'http-status'
import { Reviews } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { IAuthUser } from "../../interfaces/common";


const insertIntoDB = async (user: IAuthUser, payload: Partial<Reviews>) => {

    const patiendData = await prisma.patient.findUniqueOrThrow({
        where: {
            id: user?.email
        }
    })

    const appinmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId
        }
    })

    if (!(patiendData.id === appinmentData.patientId)) {
        throw new AppError(httpStatus.BAD_REQUEST, "this is not your appiments")
    }
    return await prisma.$transaction(async (tx) => {
        const result = await prisma.reviews.create({
            data: {
                appointmentId: appinmentData.id,
                doctorId: appinmentData.doctorId,
                patientId: appinmentData.patientId,
                rating: payload.rating as number,
                comments: payload.comments as string
            }
        })
        const avgRating = await tx.reviews.aggregate({
            _avg: {
                rating: true
            },
            where: {
                doctorId: appinmentData.doctorId
            }
        })
        await tx.doctor.update({
            where: {
                id: appinmentData.doctorId
            },
            data: {
                averageRating: avgRating._avg.rating as number
            }
        })
        return result
    })

}

export const ReviewsServices = {
    insertIntoDB
};