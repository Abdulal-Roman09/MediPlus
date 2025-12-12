import { Admin, Doctor, Patient, Prisma, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";
import config from "../../../config";
import sendToCloudinary from "../../../halpers/imageUploads/sendToCloudinary";
import { IUploadedFile } from "../../interfaces/file";
import { IPaginationOptions } from "../../interfaces/paginationSortFilter";
import { calculatePagination } from "../../../halpers/paginationAndSoringHalper";
import { userFilterableFields, userSearchAbleFields } from "./user.contance";

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

export const UserService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUserFromDB
}