import { DeleteObjectCommand, GetObjectAclCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ICloudInterface } from "./cloud.interface";
import { env } from "../../common/config/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface IS3loud {
  region: string;

  accessKeyId: string;
  secretAccessKey: string;
  bucketName:string;
}

export class S3CloudProvider implements ICloudInterface {
  private client: S3Client;
  private bucketName:string;
  constructor(config: IS3loud) {
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });

    this.bucketName=config.bucketName
  }

  async deleteFile(key: string): Promise<void> {

    const commnd=new DeleteObjectCommand({
        Bucket:this.bucketName,
        Key:key
    })
    

    await this.client.send(commnd)

}

  getFile(key: string): Promise<Buffer> {

    // const commnd=new GetObjectAclCommand({
    //     Bucket:this.bucketName,
    //     Key:key
    // })

    // this.client.send(commnd)


return Promise.resolve(new Buffer("88"))

  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
     const command = new PutObjectCommand({
    Bucket: this.bucketName,
    Key: `${path}/${new Date().toISOString()}/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

 await this.client.send(command)

 return command.input.Key as string

  }

  async genrateResignedUrl(file:Partial <Express.Multer.File>,path:string){

    const commnd=new PutObjectCommand({
      Bucket:this.bucketName,
      Key:`${path}/${file.originalname}`,
      ContentType:file.mimetype
    })

   return await getSignedUrl(this.client,commnd,{expiresIn:30000})


  }

}
