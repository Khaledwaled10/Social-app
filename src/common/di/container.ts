import { container } from "tsyringe";
import  { UserService } from "../../app/user/service/user.service";
import { UserController } from "../../app/user/controller/user.controller";
import { UserRepository } from "../../app/user/repository/user.repository";
import { PostService } from "../../app/post/service/post.service";
import { PostController } from "../../app/post/controller/post.controller";
import { PostRepository } from "../../app/post/repository/post.repository";
import { TOKENS } from "./tokens";
import { cacheProvider } from "../cache/init";
import { S3CloudProvider } from "../../pkj/cloud/s3.aws";
import { s3CloudProvider } from "../cloud/initS3";
import { mailjetProvider } from "../../pkj/mail/initMailJet";
import { AuthService } from "../../app/auth/service/auth.service";
import { AuthController } from "../../app/auth/controller/auth.controller";

//service
container.registerSingleton(TOKENS.UserService,UserService)
container.registerSingleton(TOKENS.PostService,PostService)
container.registerSingleton(TOKENS.AuthService,AuthService)


//controller
container.registerSingleton(TOKENS.UserController,UserController)
container.registerSingleton(TOKENS.PostController,PostController)
container.registerSingleton(TOKENS.AuthController,AuthController)



//repository

container.registerSingleton(TOKENS.UserRepository,UserRepository)
container.registerSingleton(TOKENS.PostRepository,PostRepository)




container.registerInstance(TOKENS.CacheProvider,cacheProvider)
container.registerInstance(TOKENS.CloudProvider,s3CloudProvider)
container.registerInstance(TOKENS.MailjetProvider,mailjetProvider)



export default container;




