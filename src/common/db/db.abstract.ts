import { Model, QueryFilter, QueryOptions, Types, UpdateQuery } from "mongoose"

export abstract class AbstractRepository<T>{


    constructor(private readonly model:Model<T>){

    }


      async create(data:T){
return this.model.create(data)
    }

async update(
  filter: QueryFilter<T>,
  newData: UpdateQuery<T>,
  options: QueryOptions<T> = { new: true }
) {
  return this.model.findOneAndUpdate(
    filter,
    { $set: newData },
    options
  );
}

async delete(id:Types.ObjectId){
   return this.model.deleteOne({_id:id})
}

}