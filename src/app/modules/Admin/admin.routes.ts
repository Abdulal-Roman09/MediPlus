import express from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middleWares/auth';
import { AdminController } from './admin.controller';
import { AdminValidationSchema } from './admin.validation';
import validateRequest from '../../middleWares/validateRequest';


const router = express.Router();

router.get(
    "/",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    AdminController.getAllAdmin);

router.get(
    "/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    AdminController.getSingleAdmin);

router.patch(
    "/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(AdminValidationSchema.updateAdminZodSchema),
    AdminController.updateAdmin);

router.delete(
    "/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    AdminController.deleteAdmin);

router.delete(
    "/soft/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    AdminController.softDeleteAdmin);

export const AdminRoutes = router;