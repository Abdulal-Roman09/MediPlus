import express from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middleWares/auth';
import { ScheduleController } from './schedule.controller';

const router = express.Router();

router.get(
    '/',
    ScheduleController.getAllSchedulFromDB,
    auth(UserRole.DOCTOR),
)

router.get(
    '/:id',
    ScheduleController.getScheduByIdFromDB,
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
)

router.delete(
    '/:id',
    ScheduleController.deleteSchedulByIdFromDB,
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
)

router.post(
    '/',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    ScheduleController.insertIntoDB
)

export const ScheduleRoutes = router;