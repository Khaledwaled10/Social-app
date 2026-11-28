
import { injectable } from "tsyringe";
import {QueryFilter, Types, UpdateQuery } from "mongoose";
import { AbstractRepository } from "../../../common/db/db.abstract";
import { IPost, Post } from "../model/post.model";

interface PaginationOptions {
  skip: number;
  limit: number;
}

@injectable()
export class PostRepository extends AbstractRepository<IPost> {
  constructor() {
    super(Post);
  }

  // Find one active post
  async findById(id: string) {
    return Post.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  // Find all active posts
  async findAll(
    filter: QueryFilter<IPost>,
    pagination: PaginationOptions
  ) {
    return Post.find({
      ...filter,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  // Find posts by owner
  async findByUserId(
    userId: string,
    pagination: PaginationOptions
  ) {
    return Post.find({
      userId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  // Update an active post
  async updateById(
    id: string,
    data: Partial<IPost>
  ) {
    return Post.findOneAndUpdate(
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

  // Soft delete
  async softDeleteById(id: string) {
    return Post.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: { isDeleted: true },
      },
      {
        new: true,
      }
    );
  }

  // Increment comments count atomically
  async incrementCommentsCount(
    id: string,
    delta: number
  ) {
    return Post.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $inc: { commentsCounts: delta },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // Increment reactions count atomically
  async incrementReactionsCount(
    id: string,
    delta: number
  ) {
    return Post.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $inc: { reactionsCounts: delta },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // Count active posts
  async countDocuments(filter: QueryFilter<IPost> = {}) {
    return Post.countDocuments({
      ...filter,
      isDeleted: false,
    });
  }
}
