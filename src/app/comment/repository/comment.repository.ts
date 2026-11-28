
import { injectable } from "tsyringe";
import { Types } from "mongoose";
import { Comment, IComment } from "../model/comment.model";

interface PaginationOptions {
  skip: number;
  limit: number;
}

@injectable()
export class CommentRepository {
  // Create Comment or Reply
  async create(data: Partial<IComment>) {
    return Comment.create(data);
  }

  // Find Comment by ID (exclude deleted)
  async findById(id: string) {
    return Comment.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  // Get main comments of a post
  async findCommentsByPostId(
    postId: string,
    pagination: PaginationOptions
  ) {
    return Comment.find({
      postId,
      parentCommentId: null,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  // Count main comments of a post
  async countCommentsByPostId(postId: string) {
    return Comment.countDocuments({
      postId,
      parentCommentId: null,
      isDeleted: false,
    });
  }

  // Get replies of a comment
  async findRepliesByParentId(
    parentCommentId: string,
    pagination: PaginationOptions
  ) {
    return Comment.find({
      parentCommentId,
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  // Count replies
  async countRepliesByParentId(parentCommentId: string) {
    return Comment.countDocuments({
      parentCommentId,
      isDeleted: false,
    });
  }

  // Update Comment
  async updateById(
    id: string,
    data: Partial<Pick<IComment, "content">>
  ) {
    return Comment.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // Soft Delete one Comment or Reply
  async softDeleteById(id: string) {
    return Comment.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: { isDeleted: true },
      },
      { new: true }
    );
  }

  // Soft Delete all replies of a main comment
  async softDeleteRepliesByParentId(parentCommentId: string) {
    return Comment.updateMany(
      {
        parentCommentId,
        isDeleted: false,
      },
      {
        $set: { isDeleted: true },
      }
    );
  }
}
