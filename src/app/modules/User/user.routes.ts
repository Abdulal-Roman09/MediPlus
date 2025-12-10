import express, { Request, Response } from 'express';
import { UserController } from './user.controller';
import auth from '../../middleWares/auth';

const router = express.Router();

router.post("/", auth("ADMIN"), UserController.createAdmin);

export const UserRoutes = router;