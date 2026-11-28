import { Schema, model, Types, HydratedDocument } from "mongoose";

export interface IBlock {
  blockerId: Types.ObjectId;
  blockedId: Types.ObjectId;
}

const blockSchema = new Schema<IBlock>(
  {
    blockerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blockedId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

blockSchema.index(
  { blockerId: 1, blockedId: 1 },
  { unique: true }
);

blockSchema.index({ blockedId: 1, createdAt: -1 });

export type BlockDocument = HydratedDocument<IBlock>;

export const Block = model<IBlock>("Block", blockSchema);