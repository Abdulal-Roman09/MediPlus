import cloudinary from "./cloudinary";
import fs from 'fs'

const sendToCloudinary = async (file: any) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path,
            { public_id: file.originalname },
            (error, result) => {
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