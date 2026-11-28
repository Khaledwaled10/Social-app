
import { Schema, model, Types, HydratedDocument } from "mongoose";

export interface IComment {
  content: string;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  parentCommentId: Types.ObjectId | null;
  isDeleted: boolean;
}

const commentSchema = new Schema<IComment>(
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

    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
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

// Index for getting post comments
commentSchema.index({
  postId: 1,
  parentCommentId: 1,
  createdAt: -1,
});

// Index for getting replies
commentSchema.index({
  parentCommentId: 1,
  isDeleted: 1,
  createdAt: 1,
});

export type CommentDocument = HydratedDocument<IComment>;

export const Comment = model<IComment>(
  "Comment",
  commentSchema
);
