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
    message: "Specialties Create successfully",
    data: result,
  });
});


export const SpecialtiesController = {
SpecialtiesinsertIntoDB
};