import { Request, Response } from "express";
import { adminService } from "./admin.services";
import { pick } from "../../../shared/pick";





const getAllAdmin = async (req: Request, res: Response) => {

    pick(req.query, ['name', 'email'])
    const result = await adminService.getAllAdminFromDB(req.query);

    res.status(200).json({
        success: true,
        message: "admin data fatched",
        data: result
    })
};

export const adminController = {
    getAllAdmin
}