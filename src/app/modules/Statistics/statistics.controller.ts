import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/common";
import sendResponse from "../../../shared/sendResponse";
import { StatisticsServices } from "./statistics.service";


const patientCount = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser
    const period = parseInt(req.query.period as string) || 1
    const result = await StatisticsServices.patientCount(user, period);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "patient cournt created successfully",
        data: result,
    });
});


const dashboardMetaData = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {

    const user = req.user
    const result = await StatisticsServices.dashboardMetaData(user as IAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "patient cournt created successfully",
        data: result,
    });
});


export const StatisticsController = {
    patientCount,
    dashboardMetaData

};