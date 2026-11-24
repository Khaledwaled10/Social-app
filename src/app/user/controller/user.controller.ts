import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../pkj/error/appError";
import { inject, injectable } from "tsyringe";
import { UserService } from "../service/user.service";
import { TOKENS } from "../../../common/di/tokens";


@injectable()
export class UserController{
constructor(@inject(TOKENS.UserService) private readonly userService:UserService){

}
    


    uploadProfilePicture=async(req:Request,res:Response,next:NextFunction)=>{
try {

    this.userService.uploadProfilePicture(req.file as Express.Multer.File,req.user?.id)
res.json({message:"profile picture uploaded",success:true})
    
} catch (error) {
    next(error)
}
    }


        generateSingedUrl=async(req:Request,res:Response,next:NextFunction)=>{
try {
const {fileName,contentType}=req.body
   const url=await this.userService.genrateResignedUrl({mimetype:contentType,originalname:fileName},req.user?.id)
res.json({message:"Ok",success:true,data:{url}})
    
} catch (error) {
    next(error)
}
    }


    deleteProfilePicture = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user?.id) {
        throw new AppError("Unauthorized", 401);
      }

      await this.userService.deleteProfilePicture(req.user.id);

      res.status(200).json({
        message: "Profile picture deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };


}


