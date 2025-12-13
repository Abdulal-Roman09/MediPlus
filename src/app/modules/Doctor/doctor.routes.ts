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

router.delete(
    "/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    DoctorController.deleteDoctrFromDB
);
router.delete(
    "/:id/soft-delete",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    DoctorController.deleteDoctrFromDB
);



export const DoctorRoutes = router;