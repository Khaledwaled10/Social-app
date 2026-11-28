export const TOKENS = {
  // Services
  UserService: Symbol("UserService"),
  PostService: Symbol("PostService"),
  AuthService: Symbol("AuthService"),
  CommentService: Symbol("CommentService"),

  // Controllers
  UserController: Symbol("UserController"),
  PostController: Symbol("PostController"),
  AuthController: Symbol("AuthController"),
  CommentController: Symbol("CommentController"),

  // Repositories
  UserRepository: Symbol("UserRepository"),
  PostRepository: Symbol("PostRepository"),
  CommentRepository: Symbol("CommentRepository"),

  // Providers
  CloudProvider: Symbol("CloudProvider"),
  CacheProvider: Symbol("CacheProvider"),
  MailjetProvider: Symbol("MailjetProvider"),
  FirebaseProvider: Symbol("FirebaseProvider"),
  FollowService: Symbol("FollowService"),
FollowController: Symbol("FollowController"),
FollowRepository: Symbol("FollowRepository"),
};