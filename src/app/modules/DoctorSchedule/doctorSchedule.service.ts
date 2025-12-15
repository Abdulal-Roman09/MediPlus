import prisma from "../../../shared/prisma";


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

export const DoctorScheduleServices = {
    insertIntoDB,
};