import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    saltRound: Number(process.env.SALT_ROUND),

    jwt: {
        secret: process.env.JWT_SECRET as string,
        expiresIn: process.env.EXPIRES_IN as string,
    },

    refreshToken: {
        secret: process.env.REFRESH_TOKEN_SECRET as string,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    },
    resetPassToken: {
        secret: process.env.RESET_PASS_TOKEN as string,
        expiresIn: process.env.RESET_PASS_TOKEN_EXPIRES_IN as string,
        link: process.env.RESET_PASS_LINK as string
    },
    sendEmail: {
        email: process.env.EMAIL as string,
        app_pass: process.env.APP_PASS as string,
    },

    databaseUrl: process.env.DATABASE_URL as string,
}