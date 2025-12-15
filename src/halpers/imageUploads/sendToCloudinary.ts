import { ICloudinaryResponse, IUploadedFile } from "../../app/interfaces/file";
import cloudinary from "./cloudinary";
import fs from 'fs'

const sendToCloudinary = async (file: IUploadedFile): Promise<ICloudinaryResponse | undefined> => {

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path,
            (error: Error, result: ICloudinaryResponse) => {
                fs.unlinkSync(file.path)
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            }
        )
    })
}

export default sendToCloudinary