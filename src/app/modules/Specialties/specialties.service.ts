import { Request } from "express";
import prisma from "../../../shared/prisma";
import { IUploadedFile } from "../../interfaces/file";
import sendToCloudinary from "../../../halpers/imageUploads/sendToCloudinary";
import { Specialties } from "@prisma/client";


const SpecialtiesinsertIntoDB = async (req: Request & { file: IUploadedFile }) => {
    const file = req.file as IUploadedFile
    let fileUrl = "";
    if (file) {
        const uploadToCloundary = await sendToCloudinary(file)
        if (uploadToCloundary?.secure_url) {
            fileUrl = uploadToCloundary?.secure_url;
        }
    }
    const result = await prisma.specialties.create({
        data: {
            title: req.body.title,
            file: fileUrl
        }
    })
    return result
}


const getAllSpecialtiesFromDB = async (): Promise<Specialties[]> => {
    return prisma.specialties.findMany();
};

const deleteSpecialties = async (id: string) => {

    await prisma.specialties.findUniqueOrThrow({
        where: {
            id
        }
    })
    const result = await prisma.specialties.delete({
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