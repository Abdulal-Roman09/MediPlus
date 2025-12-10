import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { Request, Response } from "express";



const loginUser = catchAsync(async (req: Request, res: Response) => {

    const result = await AuthServices.loginUser(req.body)

    const { refreshToken } = result

    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "login in successfully",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange

        }
    })

})
const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies

    const result = await AuthServices.refreshToken(refreshToken)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "login in successfully",
        data: result,
        // data: {
        //     accessToken: result.accessToken,
        //     needPasswordChange: result.needPasswordChange

        // }
    })

})

export const authController = {
    loginUser,
    refreshToken
}