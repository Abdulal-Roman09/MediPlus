import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { SpecialtiesServices } from "./specialties.service";

const SpecialtiesinsertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesServices.SpecialtiesinsertIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialty created successfully",
    data: result,
  });
});

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesServices.getAllSpecialtiesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties retrieved successfully",
    data: result,
  });
});

const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await SpecialtiesServices.deleteSpecialties(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialty deleted successfully",
    data: result,
  });
});


export const SpecialtiesController = {
  SpecialtiesinsertIntoDB,
  getAllSpecialties,
  deleteSpecialties
};