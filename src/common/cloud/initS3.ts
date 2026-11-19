import { S3CloudProvider } from "../../pkj/cloud/s3.aws";
import { env } from "../config/env";

export const s3CloudProvider=new S3CloudProvider({
   
    region:env.S3Cloud.AWS_REGION,
    
        accessKeyId:env.S3Cloud.AWS_ACCESS_KEY_ID,
        secretAccessKey:env.S3Cloud.AWS_SECRET_ACCESS_KEY,
        bucketName:env.S3Cloud.AWS_BUCKET_NAME
    
})