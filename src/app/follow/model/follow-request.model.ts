
import { Schema, model, Types, HydratedDocument } from "mongoose";

export interface IFollowRequest {
  requesterId: Types.ObjectId;
  recipientId: Types.ObjectId;
}

const followRequestSchema = new Schema<IFollowRequest>(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate pending requests.
followRequestSchema.index(
  { requesterId: 1, recipientId: 1 },
  { unique: true }
);

followRequestSchema.index({ recipientId: 1, createdAt: -1 });

export type FollowRequestDocument =
  HydratedDocument<IFollowRequest>;

export const FollowRequest = model<IFollowRequest>(
  "FollowRequest",
  followRequestSchema
);
