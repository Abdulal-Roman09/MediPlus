import express from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middleWares/auth';
import { ReviewsController } from './reviews.controller';


const router = express.Router();

router.post(
    '/',
    auth(UserRole.PATIENT),
    ReviewsController.insertIntoDB
)


export const ReviewsRoutes = router;