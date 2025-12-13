import express from 'express';
import auth from '../../middleWares/auth';
import { UserRole } from '@prisma/client';
import { DoctorController } from './doctor.controller';



const router = express.Router();

router.get(
    "/",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    DoctorController.getAllDoctor
);

router.get(
    "/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    DoctorController.getSingleDoctrFromDB
);



export const DoctorRoutes = router;