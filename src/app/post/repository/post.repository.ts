import { AbstractRepository } from "../../../common/db/db.abstract";
import { IPost, Post } from "../model/post.model";

class PostRepository extends AbstractRepository<IPost>{
constructor(){
  super(Post)  
}

}