import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { pick } from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { patientFilterableFields } from "./patient.contance";
import { PatientService } from "./patient.service";

const getAllPatient = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await PatientService.getAllPatientFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patients fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getSinglePatient = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await PatientService.getSinglePatientFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient fetched successfully",
        data: result,
    });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientService.updatePatientFromDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient updated successfully",
        data: result,
    });
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientService.deletePatientFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient deleted successfully",
        data: result,
    });
});

const softDeletePatient = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientService.softDeletePatientFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient soft deleted successfully",
        data: result,
    });
});

export const PatientController = {
    getAllPatient,
    getSinglePatient,
    updatePatient,
    deletePatient,
    softDeletePatient,
};