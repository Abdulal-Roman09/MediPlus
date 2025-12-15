import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { ScheduleServices } from "./schedule.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleServices.insertIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Scedule created successfully",
        data: result,
    });
});


export const ScheduleController = {
    insertIntoDB,
};