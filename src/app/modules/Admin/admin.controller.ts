import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import { adminService } from "./admin.services";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constance";

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await adminService.getAllAdminFromDB(filters, options);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admins fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to fetch admins",
      meta: null,
      data: null,
    });
  }
};

const getSingleAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.getSingleAdminFromDB(id);

    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Admin not found",
        meta: null,
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin fetched successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to fetch admin",
      meta: null,
      data: null,
    });
  }
};

const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.updateAdminIntoDB(id, req.body);

    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Admin not found or no changes made",
        meta: null,
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin updated successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to update admin",
      meta: null,
      data: null,
    });
  }
};

const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteAdminIntoDB(id);

    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Admin not found",
        meta: null,
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to delete admin",
      meta: null,
      data: null,
    });
  }
};

const softDeleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.softDeleteAdminIntoDB(id);

    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Admin not found",
        meta: null,
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin soft deleted successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to soft delete admin",
      meta: null,
      data: null,
    });
  }
};

export const adminController = {
  getAllAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};