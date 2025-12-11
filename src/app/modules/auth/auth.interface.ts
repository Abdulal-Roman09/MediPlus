

export type IUserLogin = {
    email: string;
    password: string
}
export type JwtPayloadData = {
    email: string;
    role: string
}
export type IUserResetPass = {
    id: string;
    password: string
}