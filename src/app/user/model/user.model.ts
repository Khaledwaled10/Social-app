import { Schema, model } from "mongoose";
import { Gender, Provider } from "../../../common/enum/Uenum";
import { Iuser } from "../../../common/interface/interface";

const schema = new Schema<Iuser>({
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
    required: function (this) {
      return this.provider === Provider.LOCAL;
    },
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
  profilePicturePath: String,
});

export const User = model("User", schema);
