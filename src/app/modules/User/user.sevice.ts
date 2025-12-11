import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";
import config from "../../../config";
import sendToCloudinary from "../../../halpers/imageUploads/sendToCloudinary";
import { IUploadedFile } from "../../interfaces/file";

const createAdmin = async (req: any) => {

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


export const UserService = {
    createAdmin
}