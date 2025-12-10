import jwt from "jsonwebtoken";
import { JwtPayload } from "../app/modules/auth/auth.interface";

const generateToken = (
    payload: JwtPayload,
    secret: string,
    expiresIn: string
): string => {
    return jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn,
    });
};
export default generateToken