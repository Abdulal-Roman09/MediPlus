import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { StatisticsServices } from "./statistics.service";
import { IAuthUser } from "../../interfaces/common";


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


export const StatisticsController = {
    patientCount

};