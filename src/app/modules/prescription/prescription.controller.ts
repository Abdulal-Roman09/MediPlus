import httpStatus from "http-status";
import { Request, Response } from "express";
import { IAuthUser } from "../../interfaces/common";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PrescriptionServices } from "./prescription.service";


const createPaescription = catchAsync(async (req: Request, res: Response) => {

    const user = req.body
    const result = await PrescriptionServices.createPaescription(user as IAuthUser, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Scedule created successfully",
        data: result,
    });
});

export const PrescriptionController = {
    createPaescription,
};