import { Router } from "express";
import { AuthController } from "./controller/auth.controller";
import { TOKENS } from "../../common/di/tokens";
import container from './../../common/di/container';

const authRouter = Router();

const authController=container.resolve<AuthController>(TOKENS.AuthController)

authRouter.post("/register",authController.register);
authRouter.post("/login",authController.login);
authRouter.post("/verify-account", authController.verifyEmail);
authRouter.post('/sendOtp',authController.sendotp)
authRouter.patch('/reset-password',authController.resetPassword)
authRouter.post('/loginWithGmail',authController.loginWithGoogle)

export default authRouter;