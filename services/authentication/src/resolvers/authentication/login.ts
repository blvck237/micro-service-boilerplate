import { UserRepository } from '@repositories/user.repository';
import DataBaseHandler from '@loaders/database';
import { CollectionsEnum } from '@typings/db';
import { InternalServerException } from '@core/error/exceptions';
import { AuthService } from '@services/auth.service';

export const login = async (parent: any, args: any, context: any, info: any) => {
  try {
    const { email, password } = args;
    const db = DataBaseHandler.getDb();
    const userRepository = new UserRepository(db, CollectionsEnum.USERS);
    const authService = new AuthService(userRepository);
    const user = await authService.login(email, password);
    return user;
  } catch (error) {
    throw new InternalServerException(error);
  }
};
