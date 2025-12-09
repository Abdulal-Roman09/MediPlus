import express, { Request, Response } from 'express';
import { adminController } from './admin.controller';

const router = express.Router();

router.get("/", adminController.getAllAdmin);

router.get("/:id", adminController.getSinlgeAdmin);

router.patch("/:id", adminController.updateAdmin);

router.delete("/:id", adminController.deleteAdmin);

export const AdminRoutes = router;