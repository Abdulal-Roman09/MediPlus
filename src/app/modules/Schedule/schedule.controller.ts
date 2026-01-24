import httpStatus from "http-status";
import { pick } from "../../../shared/pick";
import { Request, Response } from "express";
import { IAuthUser } from "../../interfaces/common";
import catchAsync from "../../../shared/catchAsync";
import { ScheduleServices } from "./schedule.service";
import sendResponse from "../../../shared/sendResponse";
import { scheduleSearchableFields } from "./schedule.contancts";

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

const getScheduByIdFromDB = catchAsync(async (req: Request , res: Response) => {

    const {id} = req.params
    const result = await ScheduleServices.getSchedulByIdFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctors retrieved successfully",
        data: result
    });
});

const deleteSchedulByIdFromDB = catchAsync(async (req: Request , res: Response) => {
    const {id} = req.params
    const result = await ScheduleServices.deleteSchedulByIdFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctors Data delete successfully",
        data: result
    });
});

export const ScheduleController = {
    insertIntoDB,
    getAllSchedulFromDB,
    getScheduByIdFromDB,
    deleteSchedulByIdFromDB
};