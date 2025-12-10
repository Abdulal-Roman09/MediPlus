import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.sevice";


const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.createAdmin(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Admin created successfully",
        data: result,
    });
});

export const userController = {
    createAdmin,
};