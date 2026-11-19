import { NextFunction, Request, Response } from "express";
import authService, { AuthService } from "../service/auth.service";
import { toMs } from "../../../pkj/time/time";
import { JwtPayload } from "jsonwebtoken";

class AuthController{
    private authservice:AuthService=authService
    constructor(){

    }

 register=async (req:Request,res:Response,next:NextFunction)=>{
try {
    
    const user=await this.authservice.register(req.body)
res.status(201).json({message:"user create successfully",success:true,data:user})

} catch (error) {
    next(error)
}

}


  verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, code } = req.body;

      const result = await authService.verifyEmail(email, code);

      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };

  

login =async (req:Request,res:Response,next:NextFunction)=>{

    try {


    const result=await this.authservice.login(req.body);

   


    return res.status(200).json({
      success: true,
      message: "Login successful",
      result:result
    });
  } catch (error) {
    next(error);
  }


}


  sendotp=async(req:Request,res:Response,next:NextFunction)=> {

  const { email } = req.body;
  try {
    const token = await this.authservice.sendOtp(email);
    return res.status(201).json({
      message: "Send Otp successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
}


 resetPassword=async(req:Request, res:Response, next:NextFunction)=> {

  const { email, code, newPassword } = req.body;
  try {
    await this.authservice.resetPassword(email, code, newPassword);
    return res.status(201).json({
      message: "Reset Password successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
}




loginWithGoogle=async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const token = await authService.loginGoogle(req.body.idToken);

    console.log("TOKEN FROM SERVICE:", token);
    console.log("TOKEN TYPE:", typeof token);

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: toMs(1, "hours"),
    });

    return res.status(201).json({
      message: "Login With Google successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
}





}


export default new AuthController();