import { Router } from "express";
import { guard } from "../../common/auth/guard";
import { TOKENS } from "../../common/di/tokens";
import container from "../../common/di/container";
import { CommentController } from "./controller/comment.controller";

const commentRouter = Router();

const commentController =
  container.resolve<CommentController>(TOKENS.CommentController);

// Create Comment
commentRouter.post(
  "/post/:postId",
  guard,
  commentController.createComment
);

// Get Post Comments
commentRouter.get(
  "/post/:postId",
  commentController.getPostComments
);

// Create Reply
commentRouter.post(
  "/:commentId/replies",
  guard,
  commentController.createReply
);

// Get Replies
commentRouter.get(
  "/:commentId/replies",
  commentController.getReplies
);

// Update Comment / Reply
commentRouter.patch(
  "/:commentId",
  guard,
  commentController.updateComment
);

// Delete Comment / Reply
commentRouter.delete(
  "/:commentId",
  guard,
  commentController.deleteComment
);

export default commentRouter;
