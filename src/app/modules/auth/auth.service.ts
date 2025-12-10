import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import { IUserLogin } from "./auth.interface";
import { generateToken, verifyToken } from "../../../halpers/jwtHelper";
import { UserStatus } from "@prisma/client";


const loginUser = async (payload: IUserLogin) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        },
    });

    const isCorrectPassword = await bcrypt.compare(
        payload.password,
        userData.password
    );

    if (!isCorrectPassword) {
        throw new Error("Invalid email or password");
    }

    const accessToken = generateToken({ email: userData.email, role: userData.role },
        "accessToken", "5m");

    const refreshToken = generateToken({ email: userData.email, role: userData.role },
        "refreshToken", "365d");

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange,
    };
};

const refreshToken = async (token: string) => {
    let decodeData

    try {
        decodeData = verifyToken(token, 'refreshToken')
    } catch (err) {
        throw new Error("you are not authrized")
    }
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodeData?.email,
            status: UserStatus.ACTIVE
        }
    })
    const accessToken = generateToken({ email: userData.email, role: userData.role },
        "accessToken", "5m");
    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange,
    };
}


export const AuthServices = {
    loginUser,
    refreshToken
};