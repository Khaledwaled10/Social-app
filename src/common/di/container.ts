
import { container } from "tsyringe";

// User
import { UserService } from "../../app/user/service/user.service";
import { UserController } from "../../app/user/controller/user.controller";
import { UserRepository } from "../../app/user/repository/user.repository";

// Post
import { PostService } from "../../app/post/service/post.service";
import { PostController } from "../../app/post/controller/post.controller";
import { PostRepository } from "../../app/post/repository/post.repository";

// Comment
import { CommentService } from "../../app/comment/service/comment.service";
import { CommentController } from "../../app/comment/controller/comment.controller";
import { CommentRepository } from "../../app/comment/repository/comment.repository";

// Auth
import { AuthService } from "../../app/auth/service/auth.service";
import { AuthController } from "../../app/auth/controller/auth.controller";
import { FollowService } from "../../app/follow/service/follow.service";
import { FollowController } from "../../app/follow/controller/follow.controller";
import { FollowRepository } from "../../app/follow/repository/follow.repository";
// Tokens
import { TOKENS } from "./tokens";

// Providers
import { cacheProvider } from "../cache/init";
import { s3CloudProvider } from "../cloud/initS3";
import { mailjetProvider } from "../../pkj/mail/initMailJet";
import { firebaseProvider } from "../notification/init";

// =========================
// Services
// =========================

container.registerSingleton(TOKENS.UserService, UserService);
container.registerSingleton(TOKENS.PostService, PostService);
container.registerSingleton(TOKENS.AuthService, AuthService);
container.registerSingleton(TOKENS.CommentService, CommentService);
container.registerSingleton(TOKENS.FollowService, FollowService);

// =========================
// Controllers
// =========================

container.registerSingleton(TOKENS.UserController, UserController);
container.registerSingleton(TOKENS.PostController, PostController);
container.registerSingleton(TOKENS.AuthController, AuthController);
container.registerSingleton(TOKENS.CommentController, CommentController);
container.registerSingleton(TOKENS.FollowController, FollowController);
// =========================
// Repositories
// =========================

container.registerSingleton(TOKENS.UserRepository, UserRepository);
container.registerSingleton(TOKENS.PostRepository, PostRepository);
container.registerSingleton(TOKENS.CommentRepository, CommentRepository);
container.registerSingleton(TOKENS.FollowRepository, FollowRepository);
// =========================
// Providers
// =========================

container.registerInstance(TOKENS.CacheProvider, cacheProvider);
container.registerInstance(TOKENS.CloudProvider, s3CloudProvider);
container.registerInstance(TOKENS.MailjetProvider, mailjetProvider);
container.registerInstance(TOKENS.FirebaseProvider, firebaseProvider);


export default container;
