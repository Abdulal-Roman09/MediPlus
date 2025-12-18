import express from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middleWares/auth';
import { DoctorScheduleController } from './doctorSchedule.controller';


const router = express.Router();


router.post(
    '/',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.insertIntoDB
)

router.get(
    '/my-schedule',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.getMySchedulFromDB
)

router.get(
    '/my-schedule/:id',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.deleteMySchedulByIdFromDB
)

export const DoctorScheduleRoutes = router;