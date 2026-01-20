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

    const result = await DoctorService.getAllDoctorFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctors retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getSingleDoctrFromDB = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params
    const result = await DoctorService.getSingleDoctrFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor retrieved successfully",
        data: result
    });
});

const updateDoctrFromDB = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params
    const result = await DoctorService.updateDoctorFromDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor updated successfully",
        data: result
    });
});


const deleteDoctrFromDB = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params
    const result = await DoctorService.deleteDoctrFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor deleted successfully",
        data: result
    });
});

const softDoctrFromDB = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params
    const result = await DoctorService.getSingleDoctrFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor soft deleted successfully",
        data: result
    });
});

const aiSuggestion = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorService.aiSuggestion(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor AI suggestions retrieved successfully",
        data: result,
    });
});


export const DoctorController = {
    getAllDoctor,
    getSingleDoctrFromDB,
    updateDoctrFromDB,
    deleteDoctrFromDB,
    softDoctrFromDB,
    aiSuggestion

};