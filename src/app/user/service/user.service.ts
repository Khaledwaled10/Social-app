import { s3CloudProvider } from "../../../common/cloud/initS3";
import { ICloudInterface } from "../../../pkj/cloud/cloud.interface";
import { AppError } from "../../../pkj/error/appError";
import userRepository from "../repository/user.repository";
import * as fs from "node:fs"
class UserService{
 
    private cloudProvider:ICloudInterface=s3CloudProvider
    private userRepository=userRepository


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


deleteProfilePicture = async (userID: string) => {
    const user = await this.userRepository.getOne(userID);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.profilePicturePath) {
      throw new AppError("Profile picture not found", 404);
    }

    const key = user.profilePicturePath;

    await this.cloudProvider.deleteFile(key);

    await this.userRepository.update(
      { _id: userID },
     { $unset:{ profilePicturePath: '' }}
    );
  };





}

export default new UserService();