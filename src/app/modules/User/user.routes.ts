import express, { Request, Response } from 'express';
import { UserController } from './user.controller';
import auth from '../../middleWares/auth';
import { UserRole } from '@prisma/client';
import fileUploader from '../../../halpers/fileUploader';


const router = express.Router();


router.post(
    "/",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    fileUploader.upload.single('file'),
    UserController.createAdmin);

export const UserRoutes = router;