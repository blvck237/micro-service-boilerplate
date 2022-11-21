import { UserRepository } from '@repositories/user.repository';
import DataBaseHandler from '@loaders/database';
import { CollectionsEnum } from '@typings/db';
import { ForbiddenException, InternalServerException } from '@core/error/exceptions';
import { AuthService } from '@services/auth.service';
import { QueryResolvers } from '@generated';

export const getUserFromToken: QueryResolvers['getUserFromToken'] = async (parent, args, context, info) => {
  try {
    const { token } = args;
    const db = DataBaseHandler.getDb();
    const userRepository = new UserRepository(db, CollectionsEnum.USERS);
    const authService = new AuthService(userRepository);
    const user = await authService.getUserFromToken(token);
    return {
      _id: user._id.toString(),
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // get last token
      token: user.tokens[user.tokens.length - 1],
      refreshToken: user.refreshToken,
    };
  } catch (error) {
    throw new InternalServerException(error);
  }
};
