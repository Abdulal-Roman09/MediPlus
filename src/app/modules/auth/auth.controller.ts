import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { Request, Response } from "express";


const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.loginUser(req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "login in successfully",
        data: result
    })

})

export const authController = {
    loginUser
}