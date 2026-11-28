import { Router } from "express";
import { multerUploadSingle } from "../../common/media/multer";
import { guard } from "../../common/auth/guard";
import { UserController } from "./controller/user.controller";
import { TOKENS } from "../../common/di/tokens";
import container from './../../common/di/container';

const userRouter=Router()
const userController=container.resolve<UserController>(TOKENS.UserController)
userRouter.post('/upload-profile-pic',guard,multerUploadSingle('pp'),userController.uploadProfilePicture)

userRouter.delete(
  "/profile-picture",
  guard,
  userController.deleteProfilePicture
);


userRouter.post(
  "/resignedUrl",
  guard,
  userController.generateSingedUrl
);



userRouter.get(
  "/profile/:userId",
  userController.getProfile
);


userRouter.patch(
  "/profile",
  guard,
  userController.updateProfile
);

export default userRouter;