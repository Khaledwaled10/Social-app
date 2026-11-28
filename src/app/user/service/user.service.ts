import { inject, injectable } from "tsyringe";
import { s3CloudProvider } from "../../../common/cloud/initS3";
import { ICloudInterface } from "../../../pkj/cloud/cloud.interface";
import { AppError } from "../../../pkj/error/appError";
import { UserRepository } from "../repository/user.repository";
import * as fs from "node:fs"
import { TOKENS } from "../../../common/di/tokens";

import { Types } from "mongoose";

@injectable()
export class UserService{
 
   
constructor(   @inject(TOKENS.UserRepository) private userRepository:UserRepository
,@inject(TOKENS.CloudProvider) private cloudProvider:ICloudInterface
){

}

    uploadProfilePicture = async (
  file: Express.Multer.File,
  userID: string
) => {
  const key = await this.cloudProvider.uploadFile(
    file,
    `users/${userID}`
  );

  try {
    await this.userRepository.update(
      { _id: userID },
      { profilePicturePath: key }
    );

    return key;
  } catch (error) {
    await this.cloudProvider.deleteFile(key);
    throw error;
  }
};



  genrateResignedUrl = async (
  file:Partial <Express.Multer.File>,
  userID: string
) => {

  const key = await this.cloudProvider.genrateResignedUrl(
    file,
    `users/${userID}`
  );

    return key;
  
};









  deleteProfilePicture = async (userID: string) => {
    const user = await this.userRepository.getOne(userID);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.profilePicturePath) {
      throw new AppError("Profile picture not found", 404);
    }

    const key = user.profilePicturePath;

    // Remove the reference first to avoid keeping a broken reference.
    await this.userRepository.update(
      { _id: userID },
      { $unset: { profilePicturePath: "" } }
    );

    // If S3 deletion fails, the object is orphaned but the database is consistent.
    await this.cloudProvider.deleteFile(key);
  };



  // Add these methods inside UserService

getProfile = async (profileUserId: string) => {
  if (!Types.ObjectId.isValid(profileUserId)) {
    throw new AppError("Invalid user ID", 400);
  }

  const profile = await this.userRepository.findProfileById(profileUserId);

  if (!profile) {
    throw new AppError("User not found", 404);
  }

  // Return only the fields approved by the profile privacy policy.
  return {
    userName: profile.userName,
    profilePicturePath: profile.profilePicturePath ?? null,
    bio: profile.bio ?? "",
    followersCount: profile.followersCount ?? 0,
    followingCount: profile.followingCount ?? 0,
  };
};

updateProfile = async (
  userId: string,
  data: { userName?: string; bio?: string }
) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  const updateData: { userName?: string; bio?: string } = {};

  if (data.userName !== undefined) {
    const userName = data.userName.trim();

    if (userName.length < 3 || userName.length > 20) {
      throw new AppError(
        "Username must be between 3 and 20 characters",
        400
      );
    }

    updateData.userName = userName;
  }

  if (data.bio !== undefined) {
    const bio = data.bio.trim();

    if (bio.length > 160) {
      throw new AppError("Bio cannot exceed 160 characters", 400);
    }

    updateData.bio = bio;
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError("No valid profile fields provided", 400);
  }

  const updatedProfile = await this.userRepository.updateProfile(
    userId,
    updateData
  );

  if (!updatedProfile) {
    throw new AppError("User not found", 404);
  }

  return {
    userName: updatedProfile.userName,
    profilePicturePath: updatedProfile.profilePicturePath ?? null,
    bio: updatedProfile.bio ?? "",
    followersCount: updatedProfile.followersCount ?? 0,
    followingCount: updatedProfile.followingCount ?? 0,
  };
};




}

