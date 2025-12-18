import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { ScheduleServices } from "./schedule.service";
import { scheduleSearchableFields } from "./schedule.contancts";
import { pick } from "../../../shared/pick";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleServices.insertIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Scedule created successfully",
        data: result,
    });
});

const getAllSchedulFromDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, scheduleSearchableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user
    const result = await ScheduleServices.getAllSchedulFromDB(user as IAuthUser, filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctors retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

export const ScheduleController = {
    insertIntoDB,
    getAllSchedulFromDB
};