import { Filter, Document, FindCursor, Sort, OptionalUnlessRequiredId, ObjectId, WithId, UpdateFilter, UpdateOptions } from 'mongodb';

export interface IRepository<T> {
  create?: (doc: OptionalUnlessRequiredId<T>) => Promise<T>;
  getOne?: (query: Filter<T>) => Promise<WithId<T>>;
  getMany?: (query: Filter<T>, sort: Sort) => FindCursor<WithId<T>>;
  deleteOne?: (query: Filter<T>) => Promise<boolean>;
  updateOne?: (query: Filter<T>, data: UpdateFilter<T>) => Promise<T>;
  deleteMany?: (query: Filter<T>) => Promise<boolean>;
  count?: (query: Filter<T>) => Promise<number>;
}
