
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../common/di/tokens";
import { AppError } from "../../../pkj/error/appError";
import { PostRepository } from "../repository/post.repository";
import {
  CreatePostDto,
  UpdatePostDto,
  PostQueryDto,
} from "../dto/post.dto";

@injectable()
export class PostService {
  constructor(
    @inject(TOKENS.PostRepository)
    private postRepository: PostRepository
  ) {}

  // =========================
  // 1. Create Post
  // =========================

  createPost = async (
    userId: string,
    dto: CreatePostDto
  ) => {
    if (!dto.content || !dto.content.trim()) {
      throw new AppError("Post content is required", 400);
    }

    const post = await this.postRepository.create({
      content: dto.content.trim(),
      userId,
      allowsComments: dto.allowsComments ?? true,
    } as any);

    return post;
  };

  // =========================
  // 2. Get Post By ID
  // =========================

  getPostById = async (postId: string) => {
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    return post;
  };

  // =========================
  // 3. Get All Posts
  // =========================

  getPosts = async (query: PostQueryDto) => {
    const page = Math.max(1, Number(query.page) || 1);

    const limit = Math.min(
      50,
      Math.max(1, Number(query.limit) || 10)
    );

    const skip = (page - 1) * limit;

    const filter = {
      isDeleted: false,
    };

    const [posts, totalPosts] = await Promise.all([
      this.postRepository.findAll(filter, { skip, limit }),
      this.postRepository.countDocuments(filter),
    ]);

    return {
      posts,
      pagination: {
        currentPage: page,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        hasNextPage: page * limit < totalPosts,
        hasPrevPage: page > 1,
      },
    };
  };

  // =========================
  // 4. Get User Posts
  // =========================

  getUserPosts = async (
    userId: string,
    query: PostQueryDto
  ) => {
    const page = Math.max(1, Number(query.page) || 1);

    const limit = Math.min(
      50,
      Math.max(1, Number(query.limit) || 10)
    );

    const skip = (page - 1) * limit;

    const filter = {
      userId,
      isDeleted: false,
    };

    const [posts, totalPosts] = await Promise.all([
      this.postRepository.findByUserId(userId, {
        skip,
        limit,
      }),
      this.postRepository.countDocuments(filter),
    ]);

    return {
      posts,
      pagination: {
        currentPage: page,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        hasNextPage: page * limit < totalPosts,
        hasPrevPage: page > 1,
      },
    };
  };

  // =========================
  // 5. Update Post
  // =========================

  updatePost = async (
    userId: string,
    postId: string,
    dto: UpdatePostDto
  ) => {
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    // Check ownership
    if (post.userId.toString() !== userId) {
      throw new AppError(
        "You are not allowed to update this post",
        403
      );
    }

    // Whitelist allowed fields
    const updateData: UpdatePostDto = {};

    if (dto.content !== undefined) {
      if (!dto.content.trim()) {
        throw new AppError(
          "Post content cannot be empty",
          400
        );
      }

      updateData.content = dto.content.trim();
    }

    if (dto.allowsComments !== undefined) {
      if (typeof dto.allowsComments !== "boolean") {
        throw new AppError(
          "allowsComments must be a boolean",
          400
        );
      }

      updateData.allowsComments = dto.allowsComments;
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError(
        "No valid fields provided for update",
        400
      );
    }

    const updatedPost =
      await this.postRepository.updateById(
        postId,
        updateData
      );

    return updatedPost;
  };

  // =========================
  // 6. Delete Post
  // =========================

  deletePost = async (
    userId: string,
    postId: string
  ) => {
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    // Check ownership
    if (post.userId.toString() !== userId) {
      throw new AppError(
        "You are not allowed to delete this post",
        403
      );
    }

    await this.postRepository.softDeleteById(postId);

    return {
      message: "Post deleted successfully",
    };
  };
}
