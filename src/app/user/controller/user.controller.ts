import { NextFunction, Request, Response } from "express";
import userService from "../service/user.service";
import { AppError } from "../../../pkj/error/appError";

class UserController{

    private readonly userService=userService


    uploadProfilePicture=async(req:Request,res:Response,next:NextFunction)=>{
try {

    this.userService.uploadProfilePicture(req.file as Express.Multer.File,req.user?.id)
res.json({message:"profile picture uploaded",success:true})
    
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


export default new UserController()