import { Router } from "express";
import userController from "./controller/user.controller";
import { multerUploadSingle } from "../../common/media/multer";
import { guard } from "../../common/auth/guard";

const userRouter=Router()

userRouter.post('/upload-profile-pic',guard,multerUploadSingle('pp'),userController.uploadProfilePicture)

userRouter.delete(
  "/profile-picture",
  guard,
  userController.deleteProfilePicture
);

export default userRouter;