import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";
import config from "../../../config";
import sendToCloudinary from "../../../halpers/uploader";



const createAdmin = async (req: any) => {


    const file = req.file
    if (file) {
        const uploadToCloudinary = await sendToCloudinary(file)
        console.log("file uploaded:", uploadToCloudinary)
    }

    // const hashedPassword: string = await bcrypt.hash(data.password, config.saltRound)

    // const userData = {
    //     email: data.admin.email,
    //     password: hashedPassword,
    //     role: UserRole.ADMIN
    // }

    // const result = await prisma.$transaction(async (transactionClient) => {
    //     await transactionClient.user.create({
    //         data: userData
    //     });

    //     const createdAdminData = await transactionClient.admin.create({
    //         data: data.admin
    //     });

    //     return createdAdminData;
    // });

    // return result;
};


export const UserService = {
    createAdmin
}