import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

const validateRequest = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
            });
            return next();
        } catch (error) {
            next(error);
        }
    };
};

export default validateRequest;