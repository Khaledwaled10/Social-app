import 'dotenv/config';

export const env = {
    db: {
        url: process.env.DB_URL as string
    },

    mailjet: {
        apiKey: process.env.MAILJET_API_KEY as string,
        apiSecret: process.env.MAILJET_SECRET_KEY as string,
        fromEmail: process.env.USER_SEND_EMAIL as string,
        fromName: 'NGL-APP'
    },
    nodemailer:{
        fromEmail: process.env.USER_SEND_EMAIL as string,
password_email:process.env.PASSWORD_SEND_EMAIL as string,
    },
    jwt:{
        secretKey:process.env.JWT_SECRET_KEY as string
    }
    , upstash:{
     url:  process.env.UPSTASH_REDIS_REST_URL as string ,


redis_token:process.env.UPSTASH_REDIS_REST_TOKEN as string

    },
    S3Cloud:{
        AWS_REGION:process.env.AWS_REGION as string,
        AWS_ACCESS_KEY_ID:process.env.AWS_ACCESS_KEY_ID as string,
        AWS_SECRET_ACCESS_KEY:process.env.AWS_SECRET_ACCESS_KEY as string,
        AWS_BUCKET_NAME:process.env.AWS_BUCKET_NAME as string
    }




};