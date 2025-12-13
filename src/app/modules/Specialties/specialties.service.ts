import { Request } from "express";
import prisma from "../../../shared/prisma";
import { IUploadedFile } from "../../interfaces/file";
import sendToCloudinary from "../../../halpers/imageUploads/sendToCloudinary";
import { Specialty } from "@prisma/client";

const SpecialtiesinsertIntoDB = async (req: Request & { file: IUploadedFile }) => {

    const file = req.file as IUploadedFile
    if (file) {
        const uploadToCloundary = await sendToCloudinary(file)
        req.body.icon = uploadToCloundary?.secure_url
    }
    const result = await prisma.specialty.create({
        data: req.body
    })
    return result
}


const getAllSpecialtiesFromDB = async (): Promise<Specialty[]> => {
    return prisma.specialty.findMany();
};

const deleteSpecialties = async (id: string) => {

    await prisma.specialty.findUniqueOrThrow({
        where: {
            id
        }
    })
    const result = await prisma.specialty.delete({
        where: {
            id
        }
    })
    return result
}



export const SpecialtiesServices = {
    SpecialtiesinsertIntoDB,
    getAllSpecialtiesFromDB,
    deleteSpecialties
}