import express, { Request, Response } from 'express';
import { adminController } from './admin.controller';

const router = express.Router();

router.get("/", adminController.getAllAdmin);
router.get("/:id", adminController.getSinlgeAdmin);

export const AdminRoutes = router;