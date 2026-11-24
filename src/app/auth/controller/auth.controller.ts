import { NextFunction, Request, Response } from "express";
import { AuthService } from "../service/auth.service";
import { toMs } from "../../../pkj/time/time";
import { JwtPayload } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../common/di/tokens";

@injectable()
export class AuthController{
   
    constructor(@inject(TOKENS.AuthService) private authservice:AuthService){

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

      const result = await this.authservice.verifyEmail(email, code);

      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };


  

login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await this.authservice.login(req.body);

    res.cookie("access_token", result.accessToken, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });

  } catch (error) {
    next(error);
  }
};





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




loginWithGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await this.authservice.loginGoogle(
      req.body.idToken
    );

    res.cookie("access_token", result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Google login successful",
    });
  } catch (error) {
    next(error);
  }
};





}


