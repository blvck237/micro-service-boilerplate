import { Filter, FindCursor, Sort, WithId, UpdateFilter } from 'mongodb';

export interface IRepository<T> {
  create?: (doc: Omit<T, '_id'>) => Promise<T>;
  getOne?: (query: Filter<T>) => Promise<WithId<T>>;
  getMany?: (query: Filter<T>, sort: Sort) => FindCursor<WithId<T>>;
  deleteOne?: (query: Filter<T>) => Promise<boolean>;
  updateOne?: (query: Filter<T>, data: UpdateFilter<T>) => Promise<T>;
  deleteMany?: (query: Filter<T>) => Promise<boolean>;
  count?: (query: Filter<T>) => Promise<number>;
}
