
import { inject, injectable } from "tsyringe";
import { Types } from "mongoose";

import { TOKENS } from "../../../common/di/tokens";
import { AppError } from "../../../pkj/error/appError";

import { CommentRepository } from "../repository/comment.repository";
import { PostRepository } from "../../post/repository/post.repository";

import {
  CreateCommentDto,
  CreateReplyDto,
  UpdateCommentDto,
  CommentQueryDto,
} from "../dto/comment.dto";

@injectable()
export class CommentService {
  constructor(
    @inject(TOKENS.CommentRepository)
    private commentRepository: CommentRepository,

    @inject(TOKENS.PostRepository)
    private postRepository: PostRepository
  ) {}

  // =========================
  // Pagination Helper
  // =========================

  private getPagination(query: CommentQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(query.limit) || 10)
    );

    return {
      page,
      limit,
      skip: (page - 1) * limit,
    };
  }

  // =========================
  // Validate IDs
  // =========================

  private validateId(id: string, message: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError(message, 400);
    }
  }

  // =========================
  // Validate Content
  // =========================

  private validateContent(content: unknown): string {
    if (typeof content !== "string" || !content.trim()) {
      throw new AppError("Comment content is required", 400);
    }

    return content.trim();
  }

  // =========================
  // 1. Create Main Comment
  // =========================

  createComment = async (
    userId: string,
    postId: string,
    dto: CreateCommentDto
  ) => {
    this.validateId(userId, "Invalid user ID");
    this.validateId(postId, "Invalid post ID");

    const content = this.validateContent(dto?.content);

    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (!post.allowsComments) {
      throw new AppError("Comments are disabled for this post", 403);
    }

    const comment = await this.commentRepository.create({
      content,
      userId: new Types.ObjectId(userId),
      postId: new Types.ObjectId(postId),
      parentCommentId: null,
    });

    const updatedPost =
      await this.postRepository.incrementCommentsCount(postId, 1);

    // Compensate if the post was deleted before the counter update
    if (!updatedPost) {
      await this.commentRepository.softDeleteById(
        comment._id.toString()
      );

      throw new AppError("Post not found", 404);
    }

    return comment;
  };

  // =========================
  // 2. Get Post Comments
  // =========================

  getPostComments = async (
    postId: string,
    query: CommentQueryDto
  ) => {
    this.validateId(postId, "Invalid post ID");

    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    const { page, limit, skip } = this.getPagination(query);

    const [comments, totalComments] = await Promise.all([
      this.commentRepository.findCommentsByPostId(postId, {
        skip,
        limit,
      }),

      this.commentRepository.countCommentsByPostId(postId),
    ]);

    return {
      comments,
      pagination: {
        currentPage: page,
        limit,
        totalComments,
        totalPages: Math.ceil(totalComments / limit),
        hasNextPage: page * limit < totalComments,
        hasPrevPage: page > 1,
      },
    };
  };

  // =========================
  // 3. Create Reply
  // =========================

  createReply = async (
    userId: string,
    commentId: string,
    dto: CreateReplyDto
  ) => {
    this.validateId(userId, "Invalid user ID");
    this.validateId(commentId, "Invalid comment ID");

    const content = this.validateContent(dto?.content);

    const parentComment =
      await this.commentRepository.findById(commentId);

    if (!parentComment) {
      throw new AppError("Comment not found", 404);
    }

    // Replies can only belong to main comments
    if (parentComment.parentCommentId !== null) {
      throw new AppError(
        "You can only reply to a main comment",
        400
      );
    }

    const post = await this.postRepository.findById(
      parentComment.postId.toString()
    );

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (!post.allowsComments) {
      throw new AppError("Comments are disabled for this post", 403);
    }

    const reply = await this.commentRepository.create({
      content,
      userId: new Types.ObjectId(userId),
      postId: parentComment.postId,
      parentCommentId: parentComment._id,
    });

    return reply;
  };

  // =========================
  // 4. Get Replies
  // =========================

  getReplies = async (
    commentId: string,
    query: CommentQueryDto
  ) => {
    this.validateId(commentId, "Invalid comment ID");

    const parentComment =
      await this.commentRepository.findById(commentId);

    if (!parentComment) {
      throw new AppError("Comment not found", 404);
    }

    if (parentComment.parentCommentId !== null) {
      throw new AppError(
        "Replies can only be retrieved for a main comment",
        400
      );
    }

    const { page, limit, skip } = this.getPagination(query);

    const [replies, totalReplies] = await Promise.all([
      this.commentRepository.findRepliesByParentId(commentId, {
        skip,
        limit,
      }),

      this.commentRepository.countRepliesByParentId(commentId),
    ]);

    return {
      replies,
      pagination: {
        currentPage: page,
        limit,
        totalReplies,
        totalPages: Math.ceil(totalReplies / limit),
        hasNextPage: page * limit < totalReplies,
        hasPrevPage: page > 1,
      },
    };
  };

  // =========================
  // 5. Update Comment / Reply
  // =========================

  updateComment = async (
    userId: string,
    commentId: string,
    dto: UpdateCommentDto
  ) => {
    this.validateId(userId, "Invalid user ID");
    this.validateId(commentId, "Invalid comment ID");

    const comment =
      await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    if (comment.userId.toString() !== userId) {
      throw new AppError(
        "You are not allowed to update this comment",
        403
      );
    }

    const content = this.validateContent(dto?.content);

    const updatedComment =
      await this.commentRepository.updateById(commentId, {
        content,
      });

    if (!updatedComment) {
      throw new AppError("Comment not found", 404);
    }

    return updatedComment;
  };

  // =========================
  // 6. Delete Comment / Reply
  // =========================

  deleteComment = async (
    userId: string,
    commentId: string
  ) => {
    this.validateId(userId, "Invalid user ID");
    this.validateId(commentId, "Invalid comment ID");

    const comment =
      await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    if (comment.userId.toString() !== userId) {
      throw new AppError(
        "You are not allowed to delete this comment",
        403
      );
    }

    // Main comment: delete it and all its replies
    if (comment.parentCommentId === null) {
      const deletedComment =
        await this.commentRepository.softDeleteById(commentId);

      if (!deletedComment) {
        throw new AppError("Comment not found", 404);
      }

      await this.commentRepository.softDeleteRepliesByParentId(
        commentId
      );

      const updatedPost =
        await this.postRepository.incrementCommentsCount(
          comment.postId.toString(),
          -1
        );

      if (!updatedPost) {
        throw new AppError("Post not found", 404);
      }

      return {
        message: "Comment and its replies deleted successfully",
      };
    }

    // Reply: delete only this reply
    const deletedReply =
      await this.commentRepository.softDeleteById(commentId);

    if (!deletedReply) {
      throw new AppError("Comment not found", 404);
    }

    return {
      message: "Reply deleted successfully",
    };
  };
}
