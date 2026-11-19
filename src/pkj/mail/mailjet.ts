import Mailjet from "node-mailjet";



export interface Imailjet{
  apiKey:string;
      apiSecret: string;
  fromEmail:string;
  fromName:string
}

export class MailjetProvider{
    private client: Mailjet;
    private readonly fromEmail: string;
    private readonly fromName: string;

constructor(config:Imailjet){
this.client=new Mailjet({
    apiKey:config.apiKey,apiSecret:config.apiSecret
})

  this.fromEmail = config.fromEmail;
        this.fromName = config.fromName;

}


async sendmail(email:string,subject:string,html:string){
     this.client.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email:this.fromEmail,
            Name: this.fromName,
          },
          To: [
            {
              Email:email ,

            },
          ],
          Subject: subject,

          HTMLPart:html
                },
      ],
    })

 }
 


}