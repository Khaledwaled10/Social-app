
import { Schema, model } from "mongoose";
import { Gender, Provider } from "../../../common/enum/Uenum";
import { Iuser } from "../../../common/interface/interface";

const schema = new Schema<Iuser>(
  {
    userName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: function (this: Iuser) {
        return this.provider === Provider.LOCAL;
      },
      select: false,
    },

    provider: {
      type: Number,
      enum: Provider,
      default: Provider.LOCAL,
    },

    gender: {
      type: Number,
      enum: Gender,
      default: Gender.MALE,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    profilePicturePath: {
      type: String,
    },

    FCMTokens: {
      type: [String],
      default: [],
      select: false,
    },

    bio: {
      type: String,
      maxlength: 160,
      trim: true,
      default: "",
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    followersCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    followingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<Iuser>("User", schema);
