import express from 'express';
import { authController } from './auth.controller';
import auth from '../../middleWares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post(
    "/login",
    authController.loginUser);

router.post(
    "/refesh-token",
    authController.refreshToken);

router.post(
    "/change-password",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    authController.changePassword);

router.post(
    "/forget-password",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    authController.forgetPassword);

export const AuthRoutes = router;