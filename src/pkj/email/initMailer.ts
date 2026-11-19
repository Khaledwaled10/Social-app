import nodemailer from 'nodemailer';
import { env } from '../../common/config/env';

export const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.nodemailer.fromEmail,
    pass: env.nodemailer.password_email,
  },
});


