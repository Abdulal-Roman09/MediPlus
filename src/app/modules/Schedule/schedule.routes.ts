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

router.post(
    '/',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    ScheduleController.insertIntoDB
)

export const ScheduleRoutes = router;