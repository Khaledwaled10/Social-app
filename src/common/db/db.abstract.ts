import { Model, QueryFilter, QueryOptions, Types, UpdateQuery } from "mongoose"

export abstract class AbstractRepository<T> {
  constructor(
    protected readonly model: Model<T, any, any, any, any>
  ) {}

  async create(data: Partial<T>) {
    return this.model.create(data);
  }

  async findById(id: string) {
    return this.model.findById(id);
  }

  async findOne(filter: QueryFilter<T>) {
    return this.model.findOne(filter);
  }

  async findAll(
    filter: QueryFilter<T> = {},
    options: QueryOptions<T> = {}
  ) {
    return this.model
      .find(filter, null, options)
      .sort({ createdAt: -1 });
  }

  async update(
    filter: QueryFilter<T>,
    newData: UpdateQuery<T>,
    options: QueryOptions<T> = { new: true }
  ) {
    return this.model.findOneAndUpdate(
      filter,
      newData,
      options
    );
  }

  async delete(id: Types.ObjectId) {
    return this.model.deleteOne({ _id: id } as any);
  }

  async countDocuments(filter: QueryFilter<T> = {}) {
    return this.model.countDocuments(filter);
  }
}
