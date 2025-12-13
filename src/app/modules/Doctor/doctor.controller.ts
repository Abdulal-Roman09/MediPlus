import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { pick } from "../../../shared/pick";
import catchAsync from "../../../shared/catchAsync";
import { doctorFilterableFields } from "./doctor.constants";
import { DoctorService } from "./doctor.service";


const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, doctorFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await DoctorService.getAllAdminFromDB(filters, options);


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "doctors fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});


export const DoctorController = {
    getAllDoctor,

};