import { Admin, Doctor, Patient, Prisma, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";
import config from "../../../config";
import sendToCloudinary from "../../../halpers/imageUploads/sendToCloudinary";
import { IUploadedFile } from "../../interfaces/file";
import { IPaginationOptions } from "../../interfaces/paginationSortFilter";
import { calculatePagination } from "../../../halpers/paginationAndSoringHalper";
import { userFilterableFields, userSearchAbleFields } from "./user.contance";
import { IAuthUser } from "../../interfaces/common";
import { Request } from "express";

const createAdmin = async (req: any): Promise<Admin> => {

    const file: IUploadedFile = req.file
    if (file) {
        const uploadToCloudinary = await sendToCloudinary(file)
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, config.saltRound)

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        });

        return createdAdminData;
    });

    return result;
};

const createDoctor = async (req: any): Promise<Doctor> => {

    const file: IUploadedFile = req.file
    if (file) {
        const uploadToCloudinary = await sendToCloudinary(file)
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, config.saltRound)

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        });

        return createdDoctorData;
    });

    return result;
};

const createPatient = async (req: any): Promise<Patient> => {

    const file: IUploadedFile = req.file
    if (file) {
        const uploadToCloudinary = await sendToCloudinary(file)
        req.body.patient.profilePhoto = uploadToCloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, config.saltRound)

    const userData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdPatientData = await transactionClient.patient.create({
            data: req.body.patient
        });

        return createdPatientData;
    });

    return result;
};

const getAllUserFromDB = async (params: any, options: IPaginationOptions) => {

    const { skip, limit, page, sortBy, sortOrder } = calculatePagination(options);

    const { searchTerm, ...otherParams } = params;

    const filterData = Object.fromEntries(
        Object.entries(otherParams).filter(([key]) =>
            userFilterableFields.includes(key)
        )
    );

    const andConditions: Prisma.UserWhereInput[] = [];

    // Soft Delete Filter
    andConditions.push({ isDeleted: false });

    // Search Term
    if (searchTerm) {
        andConditions.push({
            OR: userSearchAbleFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    // Direct Filters
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.entries(filterData).map(([field, value]) => ({
                [field]: { equals: value },
            })),
        });
    }

    const whereCondition: Prisma.UserWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    // DB Query
    const result = await prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
            [sortBy || "createdAt"]: sortOrder || "desc",
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            doctor: true,
            patient: true
        },

    });

    const total = await prisma.user.count({ where: whereCondition });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result,
    };
};

const changeProfileStatus = async (id: string, payload: { status: UserStatus }) => {

    await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })

    const updateUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: {
            status: payload.status
        }

    })

    return updateUserStatus
}

const getMyProfile = async (payload: IAuthUser) => {

    const userData = await prisma.user.findFirstOrThrow({
        where: {
            email: payload?.email
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    })

    let profileInfo

    if (userData.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: userData.email
            }
        })
    }

    else if (userData.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: userData.email
            }
        })
    }

    else if (userData.role === UserRole.DOCTOR) {
        profileInfo = await prisma.doctor.findUnique({
            where: {
                email: userData.email
            }
        })
    }

    else if (userData.role === UserRole.PATIENT) {
        profileInfo = await prisma.patient.findUnique({
            where: {
                email: userData.email
            }
        })
    }

    return { ...userData, ...profileInfo }
}

const updateMyProfile = async (user: IAuthUser, req: Request & { file: IUploadedFile }) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: { email: user?.email }
    });

    const file = req.file as IUploadedFile;
    if (file) {
        const upload = await sendToCloudinary(file);
        req.body.profilePhoto = upload?.secure_url;
    }

    let profileInfo;

    if (userData.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userData.email
            },
            data: req.body
        });
    }

    else if (userData.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userData.email
            },
            data: req.body
        });
    }

    else if (userData.role === UserRole.DOCTOR) {
        profileInfo = await prisma.doctor.update({
            where: {
                email: userData.email
            },
            data: req.body
        });
    }

    else if (userData.role === UserRole.PATIENT) {
        profileInfo = await prisma.patient.update({
            where: {
                email: userData.email
            },
            data: req.body
        });
    }
    return { ...profileInfo }
}

export const UserService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUserFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile
}