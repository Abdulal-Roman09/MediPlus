import { NextFunction, Request, Response } from "express"
import { verifyToken } from "../../halpers/jwtHelper"
import config from "../../config"
import AppError from "../errors/AppError"
import httpStatus from "http-status"


const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization
            if (!token) {
                throw new AppError(httpStatus.UNAUTHORIZED, "you are nto authorizatied")
            }
            const verifyUser = verifyToken(token, config.jwt.secret)
            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new AppError(httpStatus.UNAUTHORIZED, "you are nto authorizatied")
            }
            next()
        } catch (err) {
            next(err
            )
        }
    }
}

export default auth