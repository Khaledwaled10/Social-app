
import { Router } from "express";
import { PostController } from "./controller/post.controller";
import { TOKENS } from "../../common/di/tokens";
import container from "../../common/di/container";




import { guard } from "../../common/auth/guard";
import { validationBody, validationParams, validationQuery } from "../../common/validation/validation";
import { createPostSchema, postIdSchema, postQuerySchema, updatePostSchema } from "./validation/post.validatio";

const postRouter = Router();

const postController = container.resolve<PostController>(
  TOKENS.PostController
);

// Create Post
postRouter.post(
  "/",
  guard,
  validationBody(createPostSchema),
  postController.createPost
);

// Get All Posts
postRouter.get(
  "/",
  guard,
  validationQuery(postQuerySchema),
  postController.getPosts
);

// Get Post By ID
postRouter.get(
  "/:postId",
  guard,
  validationParams(postIdSchema),
  postController.getPostById
);

// Update Post
postRouter.patch(
  "/:postId",
  guard,
  validationParams(postIdSchema),
  validationBody(updatePostSchema),
  postController.updatePost
);

// Delete Post
postRouter.delete(
  "/:postId",
  guard,
  validationParams(postIdSchema),
  postController.deletePost
);

export default postRouter;
