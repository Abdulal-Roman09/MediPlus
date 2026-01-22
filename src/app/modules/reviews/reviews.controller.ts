import httpStatus from "http-status";
import { Request, Response } from "express";
import { ReviewsServices } from "./reviews.service";
import { IAuthUser } from "../../interfaces/common";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";


const insertIntoDB = catchAsync(async (req: Request, res: Response) => {

    const user = req.body
    const result = await ReviewsServices.insertIntoDB(user as IAuthUser, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Reviews created successfully",
        data: result,
    });
});

export const ReviewsController = {
    insertIntoDB,
};