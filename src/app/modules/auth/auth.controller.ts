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
        message: "Login successful",
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
        message: "Access token refreshed",
        data: result,

    })

})

const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {

    const user = req.user
    const result = await AuthServices.changePassword(user, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password updated successfully",
        data: result,

    })

})

const forgetPassword = catchAsync(async (req: Request, res: Response) => {

    const result = await AuthServices.forgetPassword(req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password reset instructions sent",
        data: result,

    })

})

const resetPassword = catchAsync(async (req: Request, res: Response) => {

    const token = req.headers.authorization || ""

    const result = await AuthServices.resetPassword(token, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password successfully reset",
        data: result,

    })

})

export const authController = {
    loginUser,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword
}