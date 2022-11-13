import { ObjectId } from 'mongodb';

export type PostType = {
  _id?: ObjectId;
  title: string;
  content: string;
  createdById: string;
};
