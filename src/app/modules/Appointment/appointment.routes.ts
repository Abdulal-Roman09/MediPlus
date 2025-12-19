import express from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middleWares/auth';
import { AppoinmentController } from './appoinment.controller';


const router = express.Router();

router.get(
    '/',
    auth(UserRole.DOCTOR, UserRole.PATIENT),
    AppoinmentController.getAllAppoinmentFromDB
)

router.post(
    '/',
    auth(UserRole.DOCTOR, UserRole.PATIENT),
    AppoinmentController.createAppoinment
)



export const AppoinmentRoutes = router;