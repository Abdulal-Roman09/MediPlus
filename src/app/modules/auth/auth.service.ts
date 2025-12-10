import prisma from "../../../shared/prisma"
import bcrypt from 'bcryptjs'
import { IUserLogin } from "./auth.interface"

const loginUser = async (payload: IUserLogin) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email
        }
    })
    const isCorrectPassword =await bcrypt.compare(payload.password, userData.password)
    if (!isCorrectPassword) {
        throw new Error("Invalid email or password");
    }
    console.log(isCorrectPassword)
    return userData
}

export const AuthServices = {
    loginUser
}