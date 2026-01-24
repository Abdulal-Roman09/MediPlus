import fs from 'fs';
import path from 'path';
import bcrypt from "bcryptjs";
import httpStatus from 'http-status'
import config from "../../../config";
import emailSender from "./emailSender";
import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from '../../errors/AppError';
import { IUserLogin, IUserResetPass } from "./auth.interface";
import { generateToken, verifyToken } from "../../../halpers/jwtHelper";


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

    const accessToken = generateToken(
        {
            email: userData.email,
            role: userData.role,
            id: userData.id

        },
        config.jwt.secret, config.jwt.expiresIn);

    const refreshToken = generateToken(
        {
            email: userData.email,
            role: userData.role,
            id: userData.id
        },
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
        decodeData = verifyToken(token, config.refreshToken.secret)
    } catch (err) {
        throw new Error("you are not authrized")
    }
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodeData?.email,
            status: UserStatus.ACTIVE
        }
    })
    const accessToken = generateToken(
        {
            email: userData.email,
            role: userData.role,
            id: userData.id
        },
        config.jwt.secret, config.jwt.expiresIn);
    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange,
    };
}

const changePassword = async (user: any, payload: any) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    })

    const isCorrectPassword = await bcrypt.compare(
        payload.oldPassword,
        userData.password
    );

    if (!isCorrectPassword) {
        throw new Error("Invalid email or password");
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, config.saltRound)

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })
    return {
        message: "password change successfully"
    }
}

const forgetPassword = async (payload: { email: string }) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        },
    });

    const resetPassToken = generateToken(
        {
            email: userData.email,
            role: userData.role,
            id: userData.id
        },
        config.resetPassToken.secret,
        config.resetPassToken.expiresIn
    );

    const resetPassLink = config.resetPassToken.link + `?userId=${userData.id}&token=${resetPassToken}`

    // Load HTML Template File
    const templatePath = path.join(__dirname, './resetPasswordTemplate.html');
    let html = fs.readFileSync(templatePath, 'utf-8');

    // Replace Template Variables
    html = html.replace(/{{resetLink}}/g, resetPassLink);

    await emailSender(userData.email, html, "Password Reset – MediCare Hospital");

    return { message: 'Check your email' };
};

const resetPassword = async (token: string, payload: IUserResetPass) => {

    const userData = await prisma.user.findFirstOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    })

    const isValidToken = verifyToken(token, config.resetPassToken.secret);

    if (!isValidToken) {

        throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
    }
    const password = await bcrypt.hash(payload.password, config.saltRound)

    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    })
    return {
        message: "password is reset successfully"
    }
}

export const AuthServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword
};