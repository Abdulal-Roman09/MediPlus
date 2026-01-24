import httpStatus from 'http-status'
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { IAuthUser } from "../../interfaces/common";
import { AppointmentStatus, PaymentStatus, Prescription, UserRole } from "@prisma/client";


const createPaescription = async (user: IAuthUser, payload: Partial<Prescription>) => {

    const appinmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointmentStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID
        },
        include: {
            doctor: true
        }
    })

    if (user?.role === UserRole.DOCTOR) {
        if (!(user.email === appinmentData.doctor.email)) {
            throw new AppError(httpStatus.BAD_REQUEST, "This is not your appinments")
        }
    }

    const result = await prisma.prescription.create({
        data: {
            appointmentId: appinmentData.id,
            doctorId: appinmentData.doctor.id,
            patientId: appinmentData.patientId,
            instructions: payload.instructions as string,
            followUpDate: payload.followUpDate as Date || null
        },
        include: {
            patient: true
        }
    })
    return result
}

export const PrescriptionServices = {
    createPaescription
};