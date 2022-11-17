import { UserRepository } from '@repositories/user.repository';
import DataBaseHandler from '@loaders/database';
import { CollectionsEnum } from '@typings/db';
import { AuthService } from '@services/auth.service';
import { InternalServerException } from '@core/error/exceptions';
import { MutationResolvers } from '@generated';

export const signUp: MutationResolvers['signUp'] = async (parent, args, context, info) => {
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
