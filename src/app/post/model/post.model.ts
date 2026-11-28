
import { Schema, model, Types, HydratedDocument } from "mongoose";

export interface IPost {
  content: string;
  userId: Types.ObjectId;
  commentsCounts: number;
  reactionsCounts: number;
  allowsComments: boolean;
  isDeleted: boolean;
}

const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    commentsCounts: {
      type: Number,
      default: 0,
      min: 0,
    },

    reactionsCounts: {
      type: Number,
      default: 0,
      min: 0,
    },

    allowsComments: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export type PostDocument = HydratedDocument<IPost>;

export const Post = model<IPost>("Post", postSchema);
