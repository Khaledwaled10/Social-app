import { Gender } from "../../../common/enum/Uenum";

export interface RegisterDto{
   userName:string;
      email:string;
      password:string;
      phoneNumber:string;
      gender?:Gender
  
}


export interface LoginDto{
      email:string;
      password:string;
      fcmTokens:string
  
}



export interface SendOtpDto{
      email:string;
}


export interface VerfiyAccountDto{
      email:string;
      code:string;
}
