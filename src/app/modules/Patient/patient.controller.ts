import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { pick } from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from 'http-status'
import { patientFilterableFields } from "./patient.contance";
import { PatientService } from "./patient.service";

const getAllPatient = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await PatientService.getAllPatientFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "patient  fetched successfully",
        meta: result.meta,
        data: result.data,
    });
})

export const PatientController = {
    getAllPatient
};