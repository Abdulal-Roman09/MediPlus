import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/common";
import { pick } from "../../../shared/pick";
import { AppoinmentServices } from "./appoinment.service";
import { appointmentFilterableFields } from "./appoinment.contanct";


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

const getMyAppoinmentFromDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user
    const filters = pick(req.body, appointmentFilterableFields)
    const options = pick(req.body, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await AppoinmentServices.getAllAppoinmentFromDB(user as IAuthUser, filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Appoinment fatched successfully",
        data: result,
    });
});

const getAllAppoinmentFromDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user
    const filters = pick(req.body, ['status', 'paymentStatus'])
    const options = pick(req.body, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await AppoinmentServices.getAllAppoinmentFromDB(user as IAuthUser, filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Appoinment fatched successfully",
        data: result,
    });
});


export const AppoinmentController = {
    createAppoinment,
    getAllAppoinmentFromDB,
    getMyAppoinmentFromDB

};