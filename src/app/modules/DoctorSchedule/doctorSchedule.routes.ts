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



export const DoctorScheduleRoutes = router;