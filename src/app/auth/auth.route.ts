
import { Router } from "express";
import { AuthController } from "./controller/auth.controller";
import { TOKENS } from "../../common/di/tokens";
import container from "../../common/di/container";


import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  sendOtpSchema,
  resetPasswordSchema,
  googleLoginSchema,
} from "./validation/auth.validation";
import { validationBody } from "../../common/validation/validation";

const authRouter = Router();

const authController = container.resolve<AuthController>(
  TOKENS.AuthController
);

authRouter.post(
  "/register",
  validationBody(registerSchema),
  authController.register
);

authRouter.post(
  "/login",
  validationBody(loginSchema),
  authController.login
);

authRouter.post(
  "/verify-account",
  validationBody(verifyEmailSchema),
  authController.verifyEmail
);

authRouter.post(
  "/sendOtp",
  validationBody(sendOtpSchema),
  authController.sendotp
);

authRouter.patch(
  "/reset-password",
  validationBody(resetPasswordSchema),
  authController.resetPassword
);

authRouter.post(
  "/loginWithGmail",
  validationBody(googleLoginSchema),
  authController.loginWithGoogle
);

export default authRouter;
