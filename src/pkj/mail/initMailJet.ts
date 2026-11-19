import { env } from "../../common/config/env.js";
import { MailjetProvider } from "./mailjet.js";


export const mailjetProvider=new MailjetProvider({
apiKey:env.mailjet.apiKey,
apiSecret:env.mailjet.apiSecret,
fromEmail:env.mailjet.fromEmail,
fromName:'social-APP'
})