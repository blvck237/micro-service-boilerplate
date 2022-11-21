import { UserRepository } from '@repositories/user.repository';
import DataBaseHandler from '@loaders/database';
import { CollectionsEnum } from '@typings/db';
import { AuthService } from '@services/auth.service';
import { BadRequestException, InternalServerException } from '@core/error/exceptions';
import { MutationResolvers } from '@generated';
import { validatePassword } from '@utils/password';
import { ErrorCodes } from '@typings/common';
import { validateEmail } from '@utils/email';

export const signUp: MutationResolvers['signUp'] = async (parent, args, context, info) => {
  try {
    const { email, password, firstname, lastname, role } = args.user;
    const isPasswordValid = validatePassword(password);
    if (!isPasswordValid) {
      throw new BadRequestException(ErrorCodes.INVALID_PASSWORD);
    }
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      throw new BadRequestException(ErrorCodes.INVALID_EMAIL);
    }
    const db = DataBaseHandler.getDb();
    const userRepository = new UserRepository(db, CollectionsEnum.USERS);
    const authService = new AuthService(userRepository);
    const result = await authService.signup({ email, password, firstname, lastname, role });
    return {
      _id: result._id.toString(),
      email: result.email,
      firstname: result.firstname,
      lastname: result.lastname,
      role: result.role,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      token: result.tokens[0],
      refreshToken: result.refreshToken,
    };
  } catch (error) {
    throw new InternalServerException(error);
  }
};
