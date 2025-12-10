import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { JwtPayloadData } from "../app/modules/auth/auth.interface";

export const generateToken = (
    payload: JwtPayloadData,
    secret: Secret,
    expiresIn: string
): string => {
    return jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn,
    });
};
export const verifyToken = (token: string, secret: Secret) => {
   return  jwt.verify(token, secret) as JwtPayload
}