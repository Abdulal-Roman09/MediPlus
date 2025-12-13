import express, { NextFunction, Request, Response } from 'express';
import { SpecialtiesController } from './specialties.controller';
import fileUploader from '../../../halpers/imageUploads/multer';
import { SpecialtiesValidationSchema } from './specialties.validation';
import { UserRole } from '@prisma/client';
import auth from '../../middleWares/auth';

const router = express.Router();

router.post(
    '/',
    auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.PATIENT),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecialtiesValidationSchema.createSpecialties.parse(JSON.parse(req.body.data))
        return SpecialtiesController.SpecialtiesinsertIntoDB(req, res, next)
    }
)

export const SpecialtiesRoutes = router;