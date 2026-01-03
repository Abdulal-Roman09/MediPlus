import express from "express";
import { AiController } from "./ai.controller";

const router = express.Router();

router.post(
    "/qa",
    AiController.geminiStrictQA
);

export const AiRoutes = router;
