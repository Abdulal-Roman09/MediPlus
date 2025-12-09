import { Request, Response } from "express";
import { adminService } from "./admin.services";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constance";

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await adminService.getAllAdminFromDB(filters, options);

    res.status(200).json({
      success: true,
      message: "Admin data fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin data",
      error: error instanceof Error ? error.message : error,
    });
  }
};
const getSinlgeAdmin = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await adminService.getSinlgeAdminFromDB(id);

    res.status(200).json({
      success: true,
      message: "single Admin data fetched successfully",

      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin data",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const adminController = {
  getAllAdmin,
  getSinlgeAdmin
};
