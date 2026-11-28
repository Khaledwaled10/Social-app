
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../pkj/error/appError";
import { TOKENS } from "../../../common/di/tokens";
import { FollowService } from "../service/follow.service";

@injectable()
export class FollowController {
  constructor(
    @inject(TOKENS.FollowService)
    private readonly followService: FollowService
  ) {}

  followUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const followerId = req.user?.id;
      const { userId } = req.params;

      if (!followerId) {
        throw new AppError("Unauthorized", 401);
      }

      if (typeof userId !== "string") {
        throw new AppError("Invalid user ID", 400);
      }

      const result = await this.followService.followUser(
        followerId,
        userId
      );

      res.status(result.status === "pending" ? 202 : 200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  unfollowUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const followerId = req.user?.id;
      const { userId } = req.params;

      if (!followerId) {
        throw new AppError("Unauthorized", 401);
      }

      if (typeof userId !== "string") {
        throw new AppError("Invalid user ID", 400);
      }

      const result = await this.followService.unfollowUser(
        followerId,
        userId
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  getFollowRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.followService.getFollowRequests(
        userId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  acceptFollowRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const recipientId = req.user?.id;
      const { requestId } = req.params;

      if (!recipientId) {
        throw new AppError("Unauthorized", 401);
      }

      if (typeof requestId !== "string") {
        throw new AppError("Invalid request ID", 400);
      }

      const result = await this.followService.acceptFollowRequest(
        recipientId,
        requestId
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  rejectFollowRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const recipientId = req.user?.id;
      const { requestId } = req.params;

      if (!recipientId) {
        throw new AppError("Unauthorized", 401);
      }

      if (typeof requestId !== "string") {
        throw new AppError("Invalid request ID", 400);
      }

      const result = await this.followService.rejectFollowRequest(
        recipientId,
        requestId
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  cancelFollowRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const requesterId = req.user?.id;
      const { requestId } = req.params;

      if (!requesterId) {
        throw new AppError("Unauthorized", 401);
      }

      if (typeof requestId !== "string") {
        throw new AppError("Invalid request ID", 400);
      }

      const result = await this.followService.cancelFollowRequest(
        requesterId,
        requestId
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };


  getFollowers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const viewerId = req.user?.id;
    const { userId } = req.params;

    if (!viewerId || typeof userId !== "string") {
      throw new AppError("Invalid request", 400);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await this.followService.getFollowers(
      viewerId,
      userId,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

getFollowing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const viewerId = req.user?.id;
    const { userId } = req.params;

    if (!viewerId || typeof userId !== "string") {
      throw new AppError("Invalid request", 400);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await this.followService.getFollowing(
      viewerId,
      userId,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


















// ==================== BLOCK ====================

blockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blockerId = req.user?.id;
    const { userId } = req.params;

    if (!blockerId || typeof userId !== "string") {
      throw new AppError("Invalid request", 400);
    }

    const result = await this.followService.blockUser(
      blockerId,
      userId
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

unblockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blockerId = req.user?.id;
    const { userId } = req.params;

    if (!blockerId || typeof userId !== "string") {
      throw new AppError("Invalid request", 400);
    }

    const result = await this.followService.unblockUser(
      blockerId,
      userId
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== REMOVE FOLLOWER ====================

removeFollower = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id;
    const { followerId } = req.params;

    if (!ownerId || typeof followerId !== "string") {
      throw new AppError("Invalid request", 400);
    }

    const result = await this.followService.removeFollower(
      ownerId,
      followerId
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};














}
