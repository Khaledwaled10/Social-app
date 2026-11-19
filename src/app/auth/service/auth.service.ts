import { LoginDto, RegisterDto } from './../dto/dto';
import bcrypt from "bcrypt";
import { Gender, Provider } from "../../../common/enum/Uenum";
import userRepository from '../../user/repository/user.repository';
import { userNotExist } from '../../user/error/error';
import { comparePassword, hashPassword } from '../../../common/utilts/hash';
import crypto, { randomUUID } from "crypto";
import { RediasCacheProvider } from '../../../pkj/cache/redis';
import * as otpRepository from "../repository/otp.repository";
import * as errorAuth from"../error/error"
import * as errorUser from "../../user/error/error"
import { mailjetProvider } from '../../../pkj/mail/initMailJet';
import { IGooglePayload, Iuser } from '../../../common/interface/interface';
import { AppError } from '../../../pkj/error/appError';
import  jwt, { JwtPayload }  from 'jsonwebtoken';
import { env } from '../../../common/config/env';
import { genrateToken } from '../../../common/utilts/token';
import { OAuth2Client } from 'google-auth-library';

export class AuthService {
  private client = new OAuth2Client();
  constructor() {}



async register(registerdto: RegisterDto) {
  const isEmailExist = await userRepository.findByEmail(
    registerdto.email
  );

  if (isEmailExist) {
    throw new AppError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(
    registerdto.password,
    12
  );

  const user = await userRepository.create({
    userName: registerdto.userName,
    email: registerdto.email,
    password: hashedPassword,
    provider: Provider.LOCAL,
    gender: registerdto.gender ?? Gender.MALE,
    isVerified: false
  });

  const code = crypto.randomInt(100000, 1000000).toString();

  await otpRepository.createOtp(user.email, code);

  await mailjetProvider.sendmail(
    user.email,
    "Email Verification",
    `<h1>Your verification code is: ${code}</h1>`
  );

  return {
    message: "Verification code sent to your email"
  };
}





async verifyEmail(email: string, code: string) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isVerified) {
    errorUser.userAlreadyVerified();
  }

  const storedOtp = await otpRepository.getOtp(email);

  console.log({
    email,
    receivedCode: code,
    storedOtp,
    receivedType: typeof code,
    storedType: typeof storedOtp
  });

  if (!storedOtp || storedOtp.trim() !== code.trim()) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  await userRepository.update(
    { _id: user._id },
    { isVerified: true },
    { new: true }
  );

  await otpRepository.deleteOtp(email);

  return {
    message: "Email verified successfully"
  };
}



async login(loginDto: LoginDto) {
  // 1. Find user
  const user = await userRepository.findByEmail(
    loginDto.email
  );

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // 2. Compare password
  const match = await comparePassword(
    loginDto.password,
    user.password
  );

  if (!match) {
    throw new AppError("Invalid email or password", 401);
  }

  // 3. Check email verification
  if (user.isVerified !== true) {
    errorUser.userNotVerified();
  }

  const accessToken = jwt.sign(
    { id: user._id },
    env.jwt.secretKey,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    env.jwt.secretKey,
    { expiresIn: "7d" }
  );

  return {
    message: "Login successful",
    accessToken,
    refreshToken
  };
}





 async sendOtp(email:string){
  //user exist

  const user = await userRepository.findByEmail(email);

  if (user===null){
    throw new AppError("Invalid email or password", 401);
  };

  

  //delete old otp

  await otpRepository.deleteOtp(email);

  //generate otp

  const code = crypto.randomInt(100000, 999999).toString();

 await otpRepository.createOtp(
   user.email,
  code,
);


  //send otp
 await mailjetProvider.sendmail(user.email, "Vervication code", `<h1>OTP CODE: ${code}</h1>`);
}


async resetPassword(
  email: string,
  code: string,
  newPassword: string
) {
  // 1. Check user exists
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // 2. Check OTP exists
  const otp = await otpRepository.getOtp(email);

  if (!otp) {
    errorAuth.otpExpired();
  }

  // 3. Compare OTP
  if (String(otp).trim() !== String(code).trim()) {
    errorAuth.invalidOtp();
  }

  // 4. Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // 5. Update password
  await userRepository.update(
    { email },
    { password: hashedPassword }
  );

  // 6. Delete used OTP
  await otpRepository.deleteOtp(email);

  return {
    message: "Password reset successfully"
  };
}



async  verifyGoogle(
  idToken: string
): Promise<IGooglePayload> {
  try {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified || !payload.sub) {
      throw new AppError("Invalid Google account", 401);
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name ?? "",
      picture: payload.picture,
      email_verified: payload.email_verified,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError("Invalid Google token", 403);
  }
}


async loginGoogle(idToken: string) {

  // 1. Verify Google Token
  const payload = await this.verifyGoogle(idToken);

  // 2. Find user by email
  let user = await userRepository.findByEmail(payload.email);

  // 3. If user doesn't exist, create new user
  if (!user) {
    user = await userRepository.create({
      userName: payload.name,
      email: payload.email,
      provider: Provider.GOOGLE,
      isVerified: true,
      gender: Gender.MALE,
      password: "",
    });
  }

  // 4. Generate tokens
  return genrateToken({
    id: user._id,
    email: user.email,
  });
}





}



export default new AuthService();
