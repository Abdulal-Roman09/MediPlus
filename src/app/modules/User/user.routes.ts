import auth from '../../middleWares/auth';
import { UserRole } from '@prisma/client';
import { UserController } from './user.controller';
import { UserValidationSchema } from './user.validation';
import fileUploader from '../../../halpers/imageUploads/multer';
import validateRequest from '../../middleWares/validateRequest';
import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();
router.get(
    "/me",
    auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.PATIENT),
    UserController.getMyProfile
)

router.get(
    "/",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    UserController.getAllUserFromDB
)

router.post(
    "/create-admin",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidationSchema.createAdmin.parse(JSON.parse(req.body.data))
        return UserController.createAdmin(req, res, next)
    },
);

router.post(
    "/create-doctor",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidationSchema.createDoctor.parse(JSON.parse(req.body.data))
        return UserController.createDoctor(req, res, next)
    }
);

router.post(
    "/create-patient",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidationSchema.createPatient.parse(JSON.parse(req.body.data))
        return UserController.createPatient(req, res, next)
    }
);

router.patch(
    "/:id/status",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(UserValidationSchema.changeUserStatus),
    UserController.changeProfileStatus
)

router.patch(
    "/update-my-profile",
    auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.PATIENT),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        return UserController.updateMyProfile(req, res, next)
    },
)

export const UserRoutes = router;