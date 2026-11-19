import { Gender, Provider } from "../enum/Uenum";

export interface Iuser{
    userName:string;
    email:string;
    password:string;
    provider:Provider;
    gender:Gender
isVerified?:boolean
profilePicturePath?:string
}



export interface IGooglePayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}