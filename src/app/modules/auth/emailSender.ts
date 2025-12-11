import nodemailer from 'nodemailer';
import config from '../../../config';

const emailSender = async (
    to: string,
    html: string,
    subject: string) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: config.sendEmail.email,
            pass: config.sendEmail.app_pass,
        },
    });

    await transporter.sendMail({
        from: '" 🌿 MediCare Hospital" <mdroman45678910@gmail.com>',
        to,
        subject,
        html,
    });
};

export default emailSender;