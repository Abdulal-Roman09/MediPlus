import { NextFunction, Request, Response } from "express"
import { verifyToken } from "../../halpers/jwtHelper"
import config from "../../config"


const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization
            if (!token) {
                throw new Error("you are nto authorizatied")
            }
            const verifyUser = verifyToken(token, config.jwt.secret)
            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new Error("you are nto authorizatied")
            }
            next()
        } catch (err) {
            next(err
            )
        }
    }
}

export default auth