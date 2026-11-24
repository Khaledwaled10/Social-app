import { HydratedDocument, ObjectId, Types } from "mongoose";
import { User } from "../model/user.model";
import { AbstractRepository } from "../../../common/db/db.abstract";
import { Iuser } from "../../../common/interface/interface";
import { injectable } from "tsyringe";
@injectable()
export class UserRepository extends AbstractRepository<Iuser>{

    constructor(){
        super(User)
    }

async findByEmail(email:string):Promise<HydratedDocument<Iuser> | null>{
    return await User.findOne({email:email})
}


async getOne(id: string): Promise<HydratedDocument<Iuser> | null> {
  return User.findById(id);
}



}

export default new UserRepository()


