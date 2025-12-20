import express from 'express';
import auth from '../../middleWares/auth';
import { UserRole } from '@prisma/client';
import { StatisticsController } from './statistics.controller';


const router = express.Router();

router.post(
    "/patient-count",
    auth(UserRole.DOCTOR),
    StatisticsController.patientCount
)

export const StatisticsRoutes = router;