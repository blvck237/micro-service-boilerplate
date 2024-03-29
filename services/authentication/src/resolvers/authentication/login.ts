import { UserRepository } from '@repositories/user.repository';
import DataBaseHandler from '@loaders/database';
import { CollectionsEnum } from '@typings/db';
import { BadRequestException, InternalServerException } from '@core/error/exceptions';
import { AuthService } from '@services/auth.service';
import { MutationResolvers } from '@generated';
import { validateEmail } from '@utils/email';
import { ErrorCodes } from '@typings/common';

export const login: MutationResolvers['login'] = async (parent, args, context, info) => {
  try {
    const { email, password } = args;
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      throw new BadRequestException(ErrorCodes.INVALID_EMAIL);
    }
    const db = DataBaseHandler.getDb();
    const userRepository = new UserRepository(db, CollectionsEnum.USERS);
    const authService = new AuthService(userRepository);
    const user = await authService.login(email, password);
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
