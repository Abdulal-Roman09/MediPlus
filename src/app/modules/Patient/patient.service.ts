import prisma from "../../../shared/prisma";
import { patientSearchAbleFields } from "./patient.contance";
import { Patient, Prisma, UserStatus } from "@prisma/client";
import { IPatientFilterRequest, IPatientUpdate } from "./patient.interface";
import { calculatePagination, IPagination } from "../../../halpers/paginationAndSoringHalper";

const getAllPatientFromDB = async (params: IPatientFilterRequest, options: IPagination): Promise<Patient | null> => {

    const { skip, limit, page, } = calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.PatientWhereInput[] = [];

    // fileter soft deleted data
    andConditions.push({
        isDeleted: false
    })

    // SEARCH TERM
    if (searchTerm) {
        andConditions.push({
            OR: patientSearchAbleFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
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
    const whereCondition: Prisma.PatientWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    // QUERY
    const result = await prisma.patient.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: {
            medicalReports: true,
            patientHealthData: true
        }
    });

    const total = await prisma.patient.count({
        where: whereCondition,
    });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const getSinglePatientFromDB = async (id: string): Promise<Patient | null> => {
    const result = await prisma.patient.findUnique({
        where: {
            id,
            isDeleted: false
        },
        include: {
            medicalReports: true,
            patientHealthData: true
        }
    })
    return result
}

const updatePatientFromDB = async (id: string, payload: Partial<IPatientUpdate>): Promise<Patient | null> => {
    const { patientHealthData, medicalReport, ...patientData } = payload
    const patientInfo = await prisma.patient.findUniqueOrThrow({
        where: { id, isDeleted: false }
    })
    // update patient data
    await prisma.$transaction(async tx => {
        await tx.patient.update({
            where: { id },
            data: patientData,
            include: {
                patientHealthData: true,
                medicalReports: true
            }
        })
        // create(if not exits) or update(if exists)
        if (patientHealthData) {
            await tx.patientHealthData.upsert({
                where: {
                    patientId: patientInfo.id
                },
                update: patientHealthData,
                create: { ...patientHealthData, patientId: patientInfo.id }
            })
        }
        // create medical report
        if (medicalReport) {
            await tx.medicalReport.create({
                data: { ...medicalReport, patientId: patientInfo.id }
            })
        }
    })
    // send patient data 
    const ResponseData = await prisma.patient.findUnique({
        where: { id: patientInfo.id },
        include: {
            patientHealthData: true,
            medicalReports: true
        }
    })
    return ResponseData
}

const deletePatientFromDB = async (id: string): Promise<Patient | null> => {

    const result = await prisma.$transaction(async tx => {
        // delete medical report
        await tx.medicalReport.deleteMany({
            where: { patientId: id }
        })
        // delete health data
        await tx.patientHealthData.deleteMany({
            where: { patientId: id }
        })
        // delete patient
        const deletePatient = await tx.patient.delete({
            where: { id }
        })
        // delete user
        await tx.user.delete({
            where: { email: deletePatient.email }
        })
        return deletePatient
    })
    return result

}

const softDeletePatientFromDB = async (id: string): Promise<Patient | null> => {
    return await prisma.$transaction(async tx => {
        // update in patient
        const deletePatient = await tx.patient.update({
            where: { id },
            data: {
                isDeleted: true
            }
        })
        // update in user
        await tx.user.update({
            where: {
                email: deletePatient.email
            },
            data: {
                status: UserStatus.DELETED
            }
        })
        return deletePatient
    })

}

export const PatientService = {
    getAllPatientFromDB,
    getSinglePatientFromDB,
    updatePatientFromDB,
    deletePatientFromDB,
    softDeletePatientFromDB
};
