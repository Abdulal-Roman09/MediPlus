import cloudinary from "./cloudinary";

const sendToCloudinary = async (file: any) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path,
            { public_id: file.originalname },
            (error, result) => {
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