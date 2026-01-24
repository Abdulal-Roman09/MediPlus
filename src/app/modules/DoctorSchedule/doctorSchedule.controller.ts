import httpStatus from "http-status";
import { Request, Response } from "express";
import { pick } from "../../../shared/pick";
import { IAuthUser } from "../../interfaces/common";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DoctorScheduleServices } from "./doctorSchedule.service";
import { DoctorScheduleSearchableFields } from "./doctorSchedule.constance";


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

const getMySchedulFromDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, DoctorScheduleSearchableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user;

    const result = await DoctorScheduleServices.getMySchedulFromDB(user as IAuthUser, filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Doctor Schedules retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getAllSchedulFromDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, DoctorScheduleSearchableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await DoctorScheduleServices.getAllSchedulFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Doctor Schedules retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});


const deleteMySchedulByIdFromDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { id } = req.params;
    const user = req.user
    const result = await DoctorScheduleServices.deleteMySchedulByIdFromDB(id, user as IAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " doctor Schedule deleted successfully",
        data: result
    });
});

export const DoctorScheduleController = {
    insertIntoDB,
    getMySchedulFromDB,
    getAllSchedulFromDB,
    deleteMySchedulByIdFromDB
};