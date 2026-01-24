import httpStatus from "http-status";
import { pick } from "../../../shared/pick";
import { Request, Response } from "express";
import { UserStatus } from "@prisma/client";
import { DoctorService } from "./doctor.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { doctorFilterableFields } from "./doctor.constants";

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

const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.getSingleDoctorFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor retrieved successfully",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.updateDoctorFromDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor updated successfully",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.deleteDoctorFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});

const softDeleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorService.softDeleteDoctorFromDB(
    id,
    UserStatus.DELETED
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor soft deleted successfully",
    data: result,
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
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
  softDeleteDoctor,
  aiSuggestion,
};
