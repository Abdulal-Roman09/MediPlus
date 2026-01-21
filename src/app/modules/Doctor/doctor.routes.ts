import express from 'express';
import auth from '../../middleWares/auth';
import { UserRole } from '@prisma/client';
import { DoctorController } from './doctor.controller';


const router = express.Router();

router.get(
    "/",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN,UserRole.DOCTOR),
    DoctorController.getAllDoctor
);

router.get(
    "/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN,UserRole.DOCTOR),
    DoctorController.getSingleDoctor
);

router.patch(
    "/update/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    DoctorController.updateDoctor
);

router.delete(
    "/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    DoctorController.deleteDoctor
);

router.delete(
    "/:id/soft-delete",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    DoctorController.softDeleteDoctor
);

router.post(
  "/suggestion",
  DoctorController.aiSuggestion
);


export const DoctorRoutes = router;