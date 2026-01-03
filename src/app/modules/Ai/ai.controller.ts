import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { AiServices } from "./ai.service";

const geminiStrictQA = catchAsync(async (req: Request, res: Response) => {
    const result = await AiServices.geminiStrictQA(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "successfully retrieved",
        data: result,
    });
});

export const AiController = {
    geminiStrictQA,
};
