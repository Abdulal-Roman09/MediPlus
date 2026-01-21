import express from 'express';
import auth from '../../middleWares/auth';
import { UserRole } from '@prisma/client';
import { AppoinmentController } from './appoinment.controller';

const router = express.Router();

router.get(
    '/my-appoinment',
    auth(UserRole.DOCTOR, UserRole.PATIENT),
    AppoinmentController.getMyAppoinmentFromDB
)

router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    AppoinmentController.getAllAppoinmentFromDB
)

router.post(
    '/',
    auth(UserRole.PATIENT),
    AppoinmentController.createAppoinment
)


export const AppoinmentRoutes = router;