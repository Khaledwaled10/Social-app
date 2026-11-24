import { injectable } from "tsyringe";
import { AbstractRepository } from "../../../common/db/db.abstract";
import { IPost, Post } from "../model/post.model";
@injectable()



export class PostRepository extends AbstractRepository<IPost>{
constructor(){
  super(Post)  
}

}