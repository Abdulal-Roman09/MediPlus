import { Response } from "express";

const sendResponse = <T>(
    res: Response,
    payload: {
        statusCode: number;
        success: boolean;
        message: string;
        meta?: {
            page: number;
            limit: number;
            total: number;
        } | null;
        data: T | null;
        error?: string;
    }
) => {
    res.status(payload.statusCode).json({
        success: payload.success,
        message: payload.message,
        meta: payload.meta ?? null,
        data: payload.data ?? null,
        ...(payload.error && { error: payload.error }),
    });
};

export default sendResponse;