
import { HydratedDocument } from "mongoose";
import { injectable } from "tsyringe";

import { User } from "../model/user.model";
import { AbstractRepository } from "../../../common/db/db.abstract";
import { Iuser } from "../../../common/interface/interface";

@injectable()
export class UserRepository extends AbstractRepository<Iuser> {
  constructor() {
    super(User);
  }

  // Used by login: password is hidden by default in the User model.
  async findByEmail(
    email: string
  ): Promise<HydratedDocument<Iuser> | null> {
    return User.findOne({
      email: email.toLowerCase(),
      isDeleted: false,
    }).select("+password");
  }

  // Used for internal operations such as profile picture management.
  async getOne(id: string): Promise<HydratedDocument<Iuser> | null> {
    return User.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  // Returns only fields safe to display on a public profile.
async findProfileById(id: string) {
  console.log("REPOSITORY ID:", id);

  const user = await User.findOne({
    _id: id,
    isDeleted: { $ne: true },
  }).select(
    "userName profilePicturePath bio followersCount followingCount isPrivate"
  );

  console.log("REPOSITORY USER:", user);

  return user;
}
  // Updates only profile fields.
  async updateProfile(
    id: string,
    data: Partial<Pick<Iuser, "userName" | "gender" | "bio">>
  ) {
    return User.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select(
      "userName gender profilePicturePath bio isPrivate followersCount followingCount createdAt"
    );
  }
}
