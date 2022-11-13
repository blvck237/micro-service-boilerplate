import { UserRepository } from '@repositories/user.repository';
import DataBaseHandler from '@loaders/database';
import { CollectionsEnum } from '@typings/db';
import { AuthService } from '@services/auth.service';
import { InternalServerException } from '@core/error/exceptions';

export const signUp = async (parent: any, args: any, context: any, info: any) => {
  try {
    const { email, password, firstname, lastname, role } = args.user;
    const db = DataBaseHandler.getDb();
    const userRepository = new UserRepository(db, CollectionsEnum.USERS);
    const authService = new AuthService(userRepository);
    const result = await authService.signup({ email, password, firstname, lastname, role });
    return result;
  } catch (error) {
    throw new InternalServerException(error);
  }
};
