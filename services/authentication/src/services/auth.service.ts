import { compare, hash } from 'bcrypt';
import { ObjectId } from 'mongodb';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '@repositories/user.repository';
import { UserRole, UserType } from '@typings/user';

import { jwtConfig } from '@config/jwt';
import { AlreadyExistException, BadRequestException, ForbiddenException } from '@core/error/exceptions';
import { ErrorCodes } from '@typings/common';
import { UserInput } from '@generated';

export class AuthService {
  #userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.#userRepository = userRepository;
  }
  /**
   * Finds user by email and compares password using bcrypt.
   * Generates an auth token and refresh token that are saved in the database.
   */
  async login(email: string, password: string): Promise<UserType> {
    try {
      const user = await this.#userRepository.getOne({ email });
      if (!user) {
        throw new ForbiddenException(ErrorCodes.INVALID_CREDENTIALS);
      }
      const isPasswordValid = await this.#comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new ForbiddenException(ErrorCodes.INVALID_CREDENTIALS);
      }
      const token = await this.#generateAuthToken(user._id, user.role);
      const refreshToken = await this.#generateRefreshToken(user._id);
      // Update user with new refresh token and auth token
      const updatedUser = await this.#userRepository.updateOne({ email }, { $push: { tokens: token }, $set: { refreshToken } });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.#userRepository.getOne({ email }, { email: 1 });
    return !!user;
  }

  /**
   * Inserts a new user into the database and hashes the password using bcrypt.
   * Generates an auth token and refresh token that are saved in the database.
   */
  async signup(userInfo: UserInput): Promise<UserType> {
    try {
      const { email, password, firstname, lastname, role } = userInfo;

      const userExists = await this.userExists(email);
      if (userExists) {
        throw new AlreadyExistException(ErrorCodes.USER_ALREADY_EXISTS);
      }
      const hashedPassword = await this.#hashPassword(password);
      const _id = new ObjectId();
      const token = await this.#generateAuthToken(_id, role);
      const refreshToken = await this.#generateRefreshToken(_id);
      const data = {
        _id,
        email,
        password: hashedPassword,
        firstname,
        lastname,
        role: UserRole[role],
        tokens: [token],
        refreshToken,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const user = await this.#userRepository.create(data);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserFromToken(token: string) {
    try {
      const decoded = jwt.verify(token, jwtConfig.user.secret) as jwt.JwtPayload;
      const user = await this.#userRepository.getOne({ _id: new ObjectId(decoded._id) });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async #generateAuthToken(_id: UserType['_id'], role: string) {
    const config = jwtConfig[role];
    const token = jwt.sign({ _id }, config?.secret, {
      expiresIn: config?.duration,
    });
    return token;
  }

  async #generateRefreshToken(_id: UserType['_id']) {
    const config = jwtConfig.refresh;
    const refreshToken = jwt.sign({ _id }, config.secret, {
      expiresIn: config.duration,
    });
    return refreshToken;
  }

  async #comparePassword(reqPwd: string, pwd: string) {
    const pwdMatch = await compare(reqPwd, pwd);
    return pwdMatch;
  }

  async #hashPassword(password: string) {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
  }
}
