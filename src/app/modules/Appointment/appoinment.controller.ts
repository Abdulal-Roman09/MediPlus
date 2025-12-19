import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/common";
import { pick } from "../../../shared/pick";
import { AppoinmentServices } from "./appoinment.service";


const createAppoinment = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user
    const result = await AppoinmentServices.createAppoinment(user as IAuthUser, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Appoinment created successfully",
        data: result,
    });
});


export const AppoinmentController = {
    createAppoinment

};