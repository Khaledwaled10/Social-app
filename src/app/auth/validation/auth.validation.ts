
import { z } from "zod";
import { Gender } from "../../../common/enum/Uenum";

// Register
export const registerSchema = z.object({
  userName: z.string().trim().min(3).max(30),
  email: z.string().trim().email(),
  password: z.string().min(8),
  phoneNumber: z.string().trim().min(7).max(20),
  gender: z.nativeEnum(Gender).optional(),
});

// Login
export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
  fcmTokens: z.string().min(1),
});

// Verify email
export const verifyEmailSchema = z.object({
  email: z.string().trim().email(),
  code: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

// Send OTP
export const sendOtpSchema = z.object({
  email: z.string().trim().email(),
});

// Reset password
export const resetPasswordSchema = z.object({
  email: z.string().trim().email(),
  code: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
  newPassword: z.string().min(8),
});

// Google login
export const googleLoginSchema = z.object({
  idToken: z.string().min(1),
});
