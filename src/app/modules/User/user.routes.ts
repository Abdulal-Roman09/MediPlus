import express, { Request, Response } from 'express';
import { UserController } from './user.controller';
import auth from '../../middleWares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), UserController.createAdmin);

export const UserRoutes = router;