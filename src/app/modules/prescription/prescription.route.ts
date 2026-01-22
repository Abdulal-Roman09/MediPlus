import express from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middleWares/auth';
import { PrescriptionController } from './prescription.controller';

const router = express.Router();

router.post(
    '/',
    auth(UserRole.DOCTOR),
    PrescriptionController.createPaescription,
)


export const PrescriptionRoutes = router;