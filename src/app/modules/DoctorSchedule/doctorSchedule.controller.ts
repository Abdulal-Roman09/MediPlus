import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { DoctorScheduleServices } from "./doctorSchedule.service";
import { IAuthUser } from "../../interfaces/common";


const insertIntoDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user
    const result = await DoctorScheduleServices.insertIntoDB(user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " doctor Scedule created successfully",
        data: result,
    });
});

export const DoctorScheduleController = {
    insertIntoDB,
};