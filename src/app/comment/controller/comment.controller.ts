
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { TOKENS } from "../../../common/di/tokens";
import { AppError } from "../../../pkj/error/appError";
import { CommentService } from "../service/comment.service";

@injectable()
export class CommentController {
  constructor(
    @inject(TOKENS.CommentService)
    private commentService: CommentService
  ) {}

  // Create Main Comment
  createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const postId = req.params.postId;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      if (typeof postId !== "string") {
        throw new AppError("Invalid post ID", 400);
      }

      const comment = await this.commentService.createComment(
        userId,
        postId,
        req.body
      );

      return res.status(201).json({
        success: true,
        message: "Comment created successfully",
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get Post Comments
  getPostComments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId = req.params.postId;

      if (typeof postId !== "string") {
        throw new AppError("Invalid post ID", 400);
      }

      const result = await this.commentService.getPostComments(
        postId,
        {
          page: Number(req.query.page),
          limit: Number(req.query.limit),
        }
      );

      return res.status(200).json({
        success: true,
        message: "Comments retrieved successfully",
        data: result.comments,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create Reply
  createReply = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const commentId = req.params.commentId;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      if (typeof commentId !== "string") {
        throw new AppError("Invalid comment ID", 400);
      }

      const reply = await this.commentService.createReply(
        userId,
        commentId,
        req.body
      );

      return res.status(201).json({
        success: true,
        message: "Reply created successfully",
        data: reply,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get Replies
  getReplies = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const commentId = req.params.commentId;

      if (typeof commentId !== "string") {
        throw new AppError("Invalid comment ID", 400);
      }

      const result = await this.commentService.getReplies(
        commentId,
        {
          page: Number(req.query.page),
          limit: Number(req.query.limit),
        }
      );

      return res.status(200).json({
        success: true,
        message: "Replies retrieved successfully",
        data: result.replies,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update Comment / Reply
  updateComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const commentId = req.params.commentId;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      if (typeof commentId !== "string") {
        throw new AppError("Invalid comment ID", 400);
      }

      const comment = await this.commentService.updateComment(
        userId,
        commentId,
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "Comment updated successfully",
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete Comment / Reply
  deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const commentId = req.params.commentId;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      if (typeof commentId !== "string") {
        throw new AppError("Invalid comment ID", 400);
      }

      const result = await this.commentService.deleteComment(
        userId,
        commentId
      );

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };
}
