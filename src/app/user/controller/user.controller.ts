
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../pkj/error/appError";
import { inject, injectable } from "tsyringe";
import { UserService } from "../service/user.service";
import { TOKENS } from "../../../common/di/tokens";

@injectable()
export class UserController {
  constructor(
    @inject(TOKENS.UserService)
    private readonly userService: UserService
  ) {}

  uploadProfilePicture = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userID = req.user?.id;

      if (!userID) {
        throw new AppError("Unauthorized", 401);
      }

      const key = await this.userService.uploadProfilePicture(
        req.file as Express.Multer.File,
        userID
      );

      res.status(200).json({
        message: "Profile picture uploaded",
        success: true,
        data: { key },
      });
    } catch (error) {
      next(error);
    }
  };

  generateSingedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userID = req.user?.id;

      if (!userID) {
        throw new AppError("Unauthorized", 401);
      }

      const { fileName, contentType } = req.body;

      if (!fileName || !contentType) {
        throw new AppError("fileName and contentType are required", 400);
      }

      const url = await this.userService.genrateResignedUrl(
        {
          mimetype: contentType,
          originalname: fileName,
        },
        userID
      );

      res.status(200).json({
        message: "OK",
        success: true,
        data: { url },
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProfilePicture = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userID = req.user?.id;

      if (!userID) {
        throw new AppError("Unauthorized", 401);
      }

      await this.userService.deleteProfilePicture(userID);

      res.status(200).json({
        message: "Profile picture deleted successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };



getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("PROFILE PARAMS:", req.params);

    const { userId } = req.params;

if (typeof userId !== "string") {
  throw new AppError("Invalid user ID", 400);
}

    
    const profile = await this.userService.getProfile(userId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const profile = await this.userService.updateProfile(
      userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};










}
