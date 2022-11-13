import { Collection, Db, ObjectId, OptionalUnlessRequiredId, Filter, WithId, FindCursor, UpdateOptions, UpdateFilter } from 'mongodb';
import { IRepository } from './ibase.repository';

export abstract class BaseRepository<T> implements IRepository<T> {
  collection: Collection;

  constructor(db: Db, collectionName: string) {
    this.collection = db.collection(collectionName);
  }

  async create(item: OptionalUnlessRequiredId<T>): Promise<T> {
    const { insertedId } = await this.collection.insertOne(item);
    // Mongo v4.xx returns objectId on insert and not the inserted document
    const result = await this.collection.findOne({ _id: insertedId });
    return result as T;
  }

  getOne = async (filter: Filter<T>): Promise<WithId<T>> => {
    const document = await this.collection.findOne(filter);
    return document as WithId<T>;
  };

  getMany(query: Filter<T>, sort: any): FindCursor<WithId<T>> {
    const cursor = this.collection.find(query);
    if (sort) {
      cursor.sort(sort);
    }
    return this.collection.find(query) as FindCursor<WithId<T>>;
  }

  deleteOne = async (query: Filter<T>): Promise<boolean> => {
    const result = await this.collection.deleteOne(query);
    return result.deletedCount === 1;
  };

  deleteMany = async (query: Filter<T>): Promise<boolean> => {
    const result = await this.collection.deleteMany(query);
    return result.deletedCount > 0;
  };

  count = async (query: Filter<T>): Promise<number> => {
    const result = await this.collection.countDocuments(query);
    return result;
  };

  updateOne = async (query: Filter<T>, update: UpdateFilter<T>): Promise<T> => {
    const result = await this.collection.findOneAndUpdate(query, update, { returnDocument: 'after' });
    return result.value as T;
  };
}
