import express from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middleWares/auth';
import { ScheduleController } from './schedule.controller';

const router = express.Router();


router.post(
    '/',
    // auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.PATIENT),
    ScheduleController.insertIntoDB
)

export const ScheduleRoutes = router;