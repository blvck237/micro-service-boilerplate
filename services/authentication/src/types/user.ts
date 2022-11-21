import { ObjectId } from 'mongodb';

export type UserType = {
  _id: ObjectId;
  email: string;
  role: UserRole;
  password: string;
  firstname: string;
  lastname: string;
  createdAt: number;
  updatedAt: number;
  tokens: string[];
  refreshToken: string;
};

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
