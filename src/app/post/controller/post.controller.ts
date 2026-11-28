
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../common/di/tokens";
import { PostService } from "../service/post.service";
import { AppError } from "../../../pkj/error/appError";

@injectable()
export class PostController {
  constructor(
    @inject(TOKENS.PostService)
    private postService: PostService
  ) {}

  // =========================
  // 1. Create Post
  // =========================

  createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const post = await this.postService.createPost(
        userId,
        req.body
      );

      return res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: post,
      });
    } catch (error) {
      next(error);
    }
  };

  // =========================
  // 2. Get Post By ID
  // =========================

  getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const postId = req.params.postId;


if (typeof postId !== "string") {
  throw new AppError("Invalid post ID", 400);
}

      const post = await this.postService.getPostById(postId);

      return res.status(200).json({
        success: true,
        message: "Post retrieved successfully",
        data: post,
      });
    } catch (error) {
      next(error);
    }
  };

  // =========================
  // 3. Get All Posts
  // =========================

  getPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.postService.getPosts({
  page: Number(req.query.page),
  limit: Number(req.query.limit),
});

      return res.status(200).json({
        success: true,
        message: "Posts retrieved successfully",
        data: result.posts,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  // =========================
  // 4. Get User Posts
  // =========================

  getUserPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
     const userId = req.params.userId;

if (typeof userId !== "string") {
  throw new AppError("Invalid user ID", 400);
}

const result = await this.postService.getUserPosts(
  userId,
  {
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  }
);
      return res.status(200).json({
        success: true,
        message: "User posts retrieved successfully",
        data: result.posts,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  // =========================
  // 5. Update Post
  // =========================

  updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

const postId = req.params.postId;

if (typeof postId !== "string") {
  throw new AppError("Invalid post ID", 400);
}

const updatedPost = await this.postService.updatePost(
  userId,
  postId,
  req.body
);
  
      return res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: updatedPost,
      });
    } catch (error) {
      next(error);
    }
  };

  // =========================
  // 6. Delete Post
  // =========================

  deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

const postId = req.params.postId;

if (typeof postId !== "string") {
  throw new AppError("Invalid post ID", 400);
}

const result = await this.postService.deletePost(
  userId,
  postId
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
