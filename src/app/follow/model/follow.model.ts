
import { Schema, model, Types, HydratedDocument } from "mongoose";

export interface IFollow {
  followerId: Types.ObjectId;
  followingId: Types.ObjectId;
}

const followSchema = new Schema<IFollow>(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followingId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// A user can follow another user only once.
followSchema.index(
  { followerId: 1, followingId: 1 },
  { unique: true }
);

// Useful for retrieving a user's followers and following list.
followSchema.index({ followingId: 1, createdAt: -1 });
followSchema.index({ followerId: 1, createdAt: -1 });

export type FollowDocument = HydratedDocument<IFollow>;

export const Follow = model<IFollow>("Follow", followSchema);
