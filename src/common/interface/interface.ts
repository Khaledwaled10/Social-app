
import { Gender, Provider } from "../enum/Uenum";
import { Types } from "mongoose";

export interface Iuser {
  userName: string;
  email: string;
  password: string;
  provider: Provider;
  gender: Gender;

  isVerified?: boolean;
  profilePicturePath?: string;
  FCMTokens: string[];

  bio?: string;
  isPrivate: boolean;
  isDeleted: boolean;

  followersCount: number;
  followingCount: number;
}

export interface IGooglePayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}
