import nodemailer from "nodemailer";
import { env } from "../../common/config/env";
import { emailTransporter } from "./initMailer";

interface ISendEmail {
  to: string;
  subject: string;
  html: string;
}
export class EmailService {

  
  
  async sendEmail( { to,
    subject,
    html}:ISendEmail
  ) {
    try {
      
      const info = await  emailTransporter.sendMail({
        from: `"Example Team" <${env.mailjet.fromEmail}>`,
        to,
        subject,
        html,
      });
      
      
      return info;
    } catch (err) {
      console.log("EMAIL ERROR:", err);
      throw err;
    }
  }
}



export const emailService = new EmailService();