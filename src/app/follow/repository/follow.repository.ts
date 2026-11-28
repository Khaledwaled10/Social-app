
import { injectable } from "tsyringe";
import { Follow } from "../model/follow.model";
import { FollowRequest } from "../model/follow-request.model";
import { Block } from "../model/block.model";
import { Types } from "mongoose";

@injectable()
export class FollowRepository {
  // Check whether the relationship already exists.
  async findFollow(followerId: string, followingId: string) {
    return Follow.findOne({ followerId, followingId });
  }

  async createFollow(followerId: string, followingId: string) {
    return Follow.create({ followerId, followingId });
  }

  async deleteFollow(followerId: string, followingId: string) {
    return Follow.findOneAndDelete({ followerId, followingId });
  }

  async countFollowers(userId: string) {
    return Follow.countDocuments({ followingId: userId });
  }

  async countFollowing(userId: string) {
    return Follow.countDocuments({ followerId: userId });
  }

  // Follow requests
  async findRequest(requesterId: string, recipientId: string) {
    return FollowRequest.findOne({ requesterId, recipientId });
  }

  async createRequest(requesterId: string, recipientId: string) {
    return FollowRequest.create({ requesterId, recipientId });
  }

  async deleteRequest(requesterId: string, recipientId: string) {
    return FollowRequest.findOneAndDelete({ requesterId, recipientId });
  }

  async findRequestById(requestId: string) {
    return FollowRequest.findById(requestId);
  }



  async countPendingRequests(recipientId: string) {
    return FollowRequest.countDocuments({ recipientId });
  }

  async deleteRequestById(requestId: string) {
    return FollowRequest.findByIdAndDelete(requestId);
  }





async findPendingRequests(
  recipientId: string,
  skip: number,
  limit: number
) {
  return FollowRequest.find({ recipientId })
    .populate("requesterId", "userName profilePicturePath")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}





async deleteRequestByIdAndRecipient(
  requestId: string,
  recipientId: string
) {
  return FollowRequest.findOneAndDelete({
    _id: requestId,
    recipientId,
  });
}

async deleteRequestByIdAndRequester(
  requestId: string,
  requesterId: string
) {
  return FollowRequest.findOneAndDelete({
    _id: requestId,
    requesterId,
  });
}




async findFollowers(userId: string, skip: number, limit: number) {
  return Follow.find({ followingId: userId })
    .populate({
      path: "followerId",
      select: "userName profilePicturePath bio",
      match: { isDeleted: { $ne: true } },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

async findFollowing(userId: string, skip: number, limit: number) {
  return Follow.find({ followerId: userId })
    .populate({
      path: "followingId",
      select: "userName profilePicturePath bio",
      match: { isDeleted: { $ne: true } },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}




// ==================== BLOCK ====================

async findBlock(blockerId: string, blockedId: string) {
  return Block.findOne({ blockerId, blockedId });
}

async createBlock(blockerId: string, blockedId: string) {
  return Block.create({ blockerId, blockedId });
}

async deleteBlock(blockerId: string, blockedId: string) {
  return Block.findOneAndDelete({ blockerId, blockedId });
}

async findBlockBetweenUsers(userId1: string, userId2: string) {
  return Block.findOne({
    $or: [
      { blockerId: userId1, blockedId: userId2 },
      { blockerId: userId2, blockedId: userId1 },
    ],
  });
}

// ==================== REMOVE RELATIONSHIPS ====================

async deleteFollowsBetweenUsers(userId1: string, userId2: string) {
  return Follow.find({
    $or: [
      { followerId: userId1, followingId: userId2 },
      { followerId: userId2, followingId: userId1 },
    ],
  });
}

async deleteFollowById(followId: Types.ObjectId) {
  return Follow.findByIdAndDelete(followId);
}

async deleteRequestsBetweenUsers(userId1: string, userId2: string) {
  return FollowRequest.deleteMany({
    $or: [
      { requesterId: userId1, recipientId: userId2 },
      { requesterId: userId2, recipientId: userId1 },
    ],
  });
}





}
