import express from 'express';
import { authController } from './auth.controller';

const router = express.Router();

router.post("/login", authController.loginUser);

router.post("/refesh-token", authController.refreshToken);

export const AuthRoutes = router;