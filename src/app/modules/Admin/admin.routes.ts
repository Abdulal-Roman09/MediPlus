import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middleWares/validateRequest';
import { AdminValidationSchema } from './admin.validation';


const router = express.Router();

router.get("/", AdminController.getAllAdmin);

router.get("/:id", AdminController.getSingleAdmin);

router.patch("/:id", validateRequest(AdminValidationSchema.updateAdminZodSchema), AdminController.updateAdmin);

router.delete("/:id", AdminController.deleteAdmin);

router.delete("/soft/:id", AdminController.softDeleteAdmin);

export const AdminRoutes = router;