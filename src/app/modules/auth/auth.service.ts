import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import { IUserLogin } from "./auth.interface";
import generateToken from "../../../halpers/jwtHelper";

const loginUser = async (payload: IUserLogin) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
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
        "refershToken", "365d");

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange,
    };
};

export const AuthServices = {
    loginUser,
};