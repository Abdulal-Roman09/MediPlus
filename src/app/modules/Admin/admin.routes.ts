import express from 'express';
import { adminController } from './admin.controller';
import validateRequest from '../../../shared/validateRequest';
import { AdminValidation } from './admin.validation';




const router = express.Router();

router.get("/", adminController.getAllAdmin);

router.get("/:id", adminController.getSingleAdmin);

router.patch("/:id", validateRequest(AdminValidation.updateAdminZodSchema), adminController.updateAdmin);

router.delete("/:id", adminController.deleteAdmin);

router.delete("/soft/:id", adminController.softDeleteAdmin);

export const adminRoutes = router;