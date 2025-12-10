import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import { IUserLogin } from "./auth.interface";
import { generateToken, verifyToken } from "../../../halpers/jwtHelper";
import { UserStatus } from "@prisma/client";
import config from "../../../config";


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
        config.jwt.secret, config.jwt.expiresIn);

    const refreshToken = generateToken({ email: userData.email, role: userData.role },
        config.refreshToken.secret, config.refreshToken.expiresIn);

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
        config.jwt.secret, config.jwt.expiresIn);
    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange,
    };
}


export const AuthServices = {
    loginUser,
    refreshToken
};