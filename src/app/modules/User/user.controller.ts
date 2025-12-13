import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.sevice";
import { userFilterableFields } from "./user.contance";
import { pick } from "../../../shared/pick";
import { IAuthUser } from "../../interfaces/common";


const createAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createAdmin(req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Admin created successfully",
        data: result,
    });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createDoctor(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor Created successfuly!",
        data: result
    })
});

const createPatient = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createPatient(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor Created successfuly!",
        data: result
    })
});

const getAllUserFromDB = catchAsync(async (req: Request, res: Response) => {

    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await UserService.getAllUserFromDB(filters, options);


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params

    const result = await UserService.changeProfileStatus(id, req.body);


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "change Profile Status successfully",
        data: result
    });
});

const getMyProfile = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {

    const user = req.user

    const result = await UserService.getMyProfile(user as IAuthUser);


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "change Profile Status successfully",
        data: result
    });
});

const updateMyProfile = catchAsync(async (req: Request& { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await UserService.updateMyProfile(user as IAuthUser, req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});


export const UserController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUserFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile
};