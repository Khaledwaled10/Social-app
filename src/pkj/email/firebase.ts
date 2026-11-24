import {App,initializeApp,cert} from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'

export class FirebaseProvider{
private readonly client:App
    constructor(config:any){
this.client=initializeApp({
    credential:cert(config)
})
    }


    async sendNotfication(to:string,title:string,body:string):Promise<void>{
     const message={
        token:to,
        notification:{
            title
        }
     }  
     
     await getMessaging(this.client).send(message)

    }
}