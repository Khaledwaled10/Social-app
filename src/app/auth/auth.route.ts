import { Router } from "express";
import authController from "./controller/auth.controller";

const authRouter = Router();

authRouter.post("/register",authController.register);
authRouter.post("/login",authController.login);
authRouter.post("/verify-account", authController.verifyEmail);
authRouter.post('/sendOtp',authController.sendotp)
authRouter.patch('/reset-password',authController.resetPassword)
authRouter.post('/loginWithGmail',authController.loginWithGoogle)

export default authRouter;