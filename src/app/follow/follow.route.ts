
import { Router } from "express";
import { guard } from "../../common/auth/guard";
import { TOKENS } from "../../common/di/tokens";
import container from "../../common/di/container";
import { FollowController } from "./controller/follow.controller";

const followRouter = Router();

const followController = container.resolve<FollowController>(
  TOKENS.FollowController
);

// Follow / Unfollow
followRouter.post("/:userId", guard, followController.followUser);
followRouter.delete("/:userId", guard, followController.unfollowUser);

// Received follow requests
followRouter.get(
  "/requests",
  guard,
  followController.getFollowRequests
);

followRouter.patch(
  "/requests/:requestId/accept",
  guard,
  followController.acceptFollowRequest
);

followRouter.delete(
  "/requests/:requestId/reject",
  guard,
  followController.rejectFollowRequest
);

// Cancel a request sent by the current user
followRouter.delete(
  "/requests/:requestId",
  guard,
  followController.cancelFollowRequest
);


followRouter.get("/:userId/followers", guard, followController.getFollowers);

followRouter.get("/:userId/following", guard, followController.getFollowing);




// Block / Unblock
followRouter.post("/block/:userId", guard, followController.blockUser);
followRouter.delete("/block/:userId", guard, followController.unblockUser);

// Remove follower

followRouter.delete(
  "/followers/:followerId",
  guard,
  followController.removeFollower
);






export default followRouter;
