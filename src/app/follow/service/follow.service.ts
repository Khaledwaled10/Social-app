
import { inject, injectable } from "tsyringe";
import { Types } from "mongoose";

import { TOKENS } from "../../../common/di/tokens";
import { AppError } from "../../../pkj/error/appError";
import { UserRepository } from "../../user/repository/user.repository";
import { FollowRepository } from "../repository/follow.repository";

@injectable()
export class FollowService {
  constructor(
    @inject(TOKENS.FollowRepository)
    private readonly followRepository: FollowRepository,

    @inject(TOKENS.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  private validateId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid ID", 400);
    }
  }

  private async getActiveUser(userId: string) {
    const user = await this.userRepository.getOne(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  followUser = async (followerId: string, followingId: string) => {
    this.validateId(followerId);
    this.validateId(followingId);

    if (followerId === followingId) {
      throw new AppError("You cannot follow yourself", 400);
    }

    const [follower, target] = await Promise.all([
      this.getActiveUser(followerId),
      this.getActiveUser(followingId),
    ]);

    // Check block relationship in both directions.
const blockExists =
  await this.followRepository.findBlockBetweenUsers(
    followerId,
    followingId
  );

if (blockExists) {
  throw new AppError(
    "You cannot follow this user because a block relationship exists",
    403
  );
}

    const existingFollow = await this.followRepository.findFollow(
      followerId,
      followingId
    );

    if (existingFollow) {
      throw new AppError("You are already following this user", 409);
    }

    // Private account: create a follow request instead.
    if (target.isPrivate) {
      const existingRequest = await this.followRepository.findRequest(
        followerId,
        followingId
      );

      if (existingRequest) {
        throw new AppError("Follow request already sent", 409);
      }

      try {
        await this.followRepository.createRequest(
          followerId,
          followingId
        );
      } catch (error: any) {
        if (error.code === 11000) {
          throw new AppError("Follow request already sent", 409);
        }
        throw error;
      }

      return {
        status: "pending",
        message: "Follow request sent successfully",
      };
    }

    // Public account: create the relationship immediately.
    try {
      await this.followRepository.createFollow(followerId, followingId);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError("You are already following this user", 409);
      }
      throw error;
    }

    await Promise.all([
      this.userRepository.update(
        { _id: followerId, isDeleted: { $ne: true } },
        { $inc: { followingCount: 1 } }
      ),
      this.userRepository.update(
        { _id: followingId, isDeleted: { $ne: true } },
        { $inc: { followersCount: 1 } }
      ),
    ]);

    return {
      status: "following",
      message: "User followed successfully",
    };
  };

  unfollowUser = async (followerId: string, followingId: string) => {
    this.validateId(followerId);
    this.validateId(followingId);

    if (followerId === followingId) {
      throw new AppError("Invalid follow operation", 400);
    }

    await this.getActiveUser(followerId);
    await this.getActiveUser(followingId);

    const deletedFollow = await this.followRepository.deleteFollow(
      followerId,
      followingId
    );

    if (!deletedFollow) {
      throw new AppError("You are not following this user", 404);
    }

    await Promise.all([
      this.userRepository.update(
        { _id: followerId, followingCount: { $gt: 0 } },
        { $inc: { followingCount: -1 } }
      ),
      this.userRepository.update(
        { _id: followingId, followersCount: { $gt: 0 } },
        { $inc: { followersCount: -1 } }
      ),
    ]);

    return {
      message: "User unfollowed successfully",
    };
  };




  // Get pending follow requests received by the logged-in user.
  getFollowRequests = async (
    recipientId: string,
    page = 1,
    limit = 10
  ) => {
    this.validateId(recipientId);
    await this.getActiveUser(recipientId);

    const safePage = Math.max(1, Math.floor(page) || 1);
    const safeLimit = Math.min(50, Math.max(1, Math.floor(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    const [requests, total] = await Promise.all([
      this.followRepository.findPendingRequests(
        recipientId,
        skip,
        safeLimit
      ),
      this.followRepository.countPendingRequests(recipientId),
    ]);

    return {
      requests,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.ceil(total / safeLimit),
      },
    };
  };

  // Accept a request received by the logged-in user.
  



acceptFollowRequest = async (
  recipientId: string,
  requestId: string
) => {
  this.validateId(recipientId);
  this.validateId(requestId);

  await this.getActiveUser(recipientId);

  // Find the follow request first.
  const request = await this.followRepository.findRequestById(requestId);

  if (!request || request.recipientId.toString() !== recipientId) {
    throw new AppError("Follow request not found", 404);
  }

  const requesterId = request.requesterId.toString();

  await this.getActiveUser(requesterId);

  // Check block relationship in both directions.
  const blockExists =
    await this.followRepository.findBlockBetweenUsers(
      requesterId,
      recipientId
    );

  if (blockExists) {
    await this.followRepository.deleteRequestByIdAndRecipient(
      requestId,
      recipientId
    );

    throw new AppError(
      "Cannot accept follow request because a block relationship exists",
      403
    );
  }

  const existingFollow = await this.followRepository.findFollow(
    requesterId,
    recipientId
  );

  if (existingFollow) {
    await this.followRepository.deleteRequestByIdAndRecipient(
      requestId,
      recipientId
    );

    throw new AppError("This user is already following you", 409);
  }

  try {
    await this.followRepository.createFollow(requesterId, recipientId);
  } catch (error: any) {
    if (error.code === 11000) {
      throw new AppError("Follow relationship already exists", 409);
    }
    throw error;
  }

  const deletedRequest =
    await this.followRepository.deleteRequestByIdAndRecipient(
      requestId,
      recipientId
    );

  if (!deletedRequest) {
    await this.followRepository.deleteFollow(requesterId, recipientId);
    throw new AppError("Follow request is no longer available", 409);
  }

  await Promise.all([
    this.userRepository.update(
      { _id: requesterId, isDeleted: { $ne: true } },
      { $inc: { followingCount: 1 } }
    ),
    this.userRepository.update(
      { _id: recipientId, isDeleted: { $ne: true } },
      { $inc: { followersCount: 1 } }
    ),
  ]);

  return {
    message: "Follow request accepted successfully",
  };
};




  // Reject a request received by the logged-in user.
  rejectFollowRequest = async (
    recipientId: string,
    requestId: string
  ) => {
    this.validateId(recipientId);
    this.validateId(requestId);

    await this.getActiveUser(recipientId);

    const deletedRequest =
      await this.followRepository.deleteRequestByIdAndRecipient(
        requestId,
        recipientId
      );

    if (!deletedRequest) {
      throw new AppError("Follow request not found", 404);
    }

    return {
      message: "Follow request rejected successfully",
    };
  };

  // Cancel a request sent by the logged-in user.
  cancelFollowRequest = async (
    requesterId: string,
    requestId: string
  ) => {
    this.validateId(requesterId);
    this.validateId(requestId);

    await this.getActiveUser(requesterId);

    const deletedRequest =
      await this.followRepository.deleteRequestByIdAndRequester(
        requestId,
        requesterId
      );

    if (!deletedRequest) {
      throw new AppError("Follow request not found", 404);
    }

    return {
      message: "Follow request cancelled successfully",
    };
  };


  getFollowers = async (
  viewerId: string,
  targetUserId: string,
  page = 1,
  limit = 10
) => {
  this.validateId(viewerId);
  this.validateId(targetUserId);

  const viewer = await this.getActiveUser(viewerId);
  const targetUser = await this.getActiveUser(targetUserId);

  if (!viewer || !targetUser) {
    throw new AppError("User not found", 404);
  }

  // Private account: only owner or accepted followers can view the list
  if (
    targetUser.isPrivate &&
    viewerId !== targetUserId
  ) {
    const isFollower = await this.followRepository.findFollow(
      viewerId,
      targetUserId
    );

    if (!isFollower) {
      throw new AppError(
        "You must follow this private account to view its followers",
        403
      );
    }
  }

  const safePage = Math.max(1, Math.floor(page));
  const safeLimit = Math.min(50, Math.max(1, Math.floor(limit)));
  const skip = (safePage - 1) * safeLimit;

  const [followers, total] = await Promise.all([
    this.followRepository.findFollowers(targetUserId, skip, safeLimit),
    this.followRepository.countFollowers(targetUserId),
  ]);

  const data = followers
    .filter((item) => item.followerId)
    .map((item) => {
      const user = item.followerId as unknown as {
        _id: Types.ObjectId;
        userName: string;
        profilePicturePath?: string;
        bio?: string;
      };

      return {
        _id: user._id,
        userName: user.userName,
        profilePicturePath: user.profilePicturePath ?? null,
        bio: user.bio ?? "",
      };
    });

  return {
    users: data,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

getFollowing = async (
  viewerId: string,
  targetUserId: string,
  page = 1,
  limit = 10
) => {
  this.validateId(viewerId);
  this.validateId(targetUserId);

  const viewer = await this.getActiveUser(viewerId);
  const targetUser = await this.getActiveUser(targetUserId);

  if (!viewer || !targetUser) {
    throw new AppError("User not found", 404);
  }

  // Private account: only owner or accepted followers can view the list
  if (
    targetUser.isPrivate &&
    viewerId !== targetUserId
  ) {
    const isFollower = await this.followRepository.findFollow(
      viewerId,
      targetUserId
    );

    if (!isFollower) {
      throw new AppError(
        "You must follow this private account to view its following list",
        403
      );
    }
  }

  const safePage = Math.max(1, Math.floor(page));
  const safeLimit = Math.min(50, Math.max(1, Math.floor(limit)));
  const skip = (safePage - 1) * safeLimit;

  const [following, total] = await Promise.all([
    this.followRepository.findFollowing(targetUserId, skip, safeLimit),
    this.followRepository.countFollowing(targetUserId),
  ]);

  const data = following
    .filter((item) => item.followingId)
    .map((item) => {
      const user = item.followingId as unknown as {
        _id: Types.ObjectId;
        userName: string;
        profilePicturePath?: string;
        bio?: string;
      };

      return {
        _id: user._id,
        userName: user.userName,
        profilePicturePath: user.profilePicturePath ?? null,
        bio: user.bio ?? "",
      };
    });

  return {
    users: data,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};





// ==================== BLOCK USER ====================

blockUser = async (blockerId: string, blockedId: string) => {
  this.validateId(blockerId);
  this.validateId(blockedId);

  if (blockerId === blockedId) {
    throw new AppError("You cannot block yourself", 400);
  }

  const [blocker, blocked] = await Promise.all([
    this.getActiveUser(blockerId),
    this.getActiveUser(blockedId),
  ]);

  if (!blocker || !blocked) {
    throw new AppError("User not found", 404);
  }

  const existingBlock = await this.followRepository.findBlock(
    blockerId,
    blockedId
  );

  if (existingBlock) {
    throw new AppError("User is already blocked", 409);
  }

  try {
    await this.followRepository.createBlock(blockerId, blockedId);
  } catch (error: any) {
    if (error?.code === 11000) {
      throw new AppError("User is already blocked", 409);
    }
    throw error;
  }

  // Delete follow relationships in both directions.
  const relationships =
    await this.followRepository.deleteFollowsBetweenUsers(
      blockerId,
      blockedId
    );

  for (const relationship of relationships) {
    const deleted = await this.followRepository.deleteFollowById(
      relationship._id
    );

    // Only update counters if the relationship was actually deleted.
    if (!deleted) continue;

    await Promise.all([
      this.userRepository.update(
        { _id: relationship.followerId },
        { $inc: { followingCount: -1 } },
        { new: true }
      ),
      this.userRepository.update(
        { _id: relationship.followingId },
        { $inc: { followersCount: -1 } },
        { new: true }
      ),
    ]);
  }

  // Delete pending requests in both directions.
  await this.followRepository.deleteRequestsBetweenUsers(
    blockerId,
    blockedId
  );

  return {
    message: "User blocked successfully",
  };
};

// ==================== UNBLOCK USER ====================

unblockUser = async (blockerId: string, blockedId: string) => {
  this.validateId(blockerId);
  this.validateId(blockedId);

  const blocker = await this.getActiveUser(blockerId);

  if (!blocker) {
    throw new AppError("User not found", 404);
  }

  const deletedBlock = await this.followRepository.deleteBlock(
    blockerId,
    blockedId
  );

  if (!deletedBlock) {
    throw new AppError("Block relationship not found", 404);
  }

  return {
    message: "User unblocked successfully",
  };
};

// ==================== REMOVE FOLLOWER ====================

removeFollower = async (
  ownerId: string,
  followerId: string
) => {
  this.validateId(ownerId);
  this.validateId(followerId);

  if (ownerId === followerId) {
    throw new AppError("Invalid follower", 400);
  }

  const [owner, follower] = await Promise.all([
    this.getActiveUser(ownerId),
    this.getActiveUser(followerId),
  ]);

  if (!owner || !follower) {
    throw new AppError("User not found", 404);
  }

  // The owner is the user being followed.
  // The follower is the user who follows the owner.
  const deletedFollow = await this.followRepository.deleteFollow(
    followerId,
    ownerId
  );

  if (!deletedFollow) {
    throw new AppError("Follower relationship not found", 404);
  }

  await Promise.all([
    this.userRepository.update(
      { _id: followerId, followingCount: { $gt: 0 } },
      { $inc: { followingCount: -1 } },
      { new: true }
    ),
    this.userRepository.update(
      { _id: ownerId, followersCount: { $gt: 0 } },
      { $inc: { followersCount: -1 } },
      { new: true }
    ),
  ]);

  return {
    message: "Follower removed successfully",
  };
};









}
