import { compare, hash } from 'bcrypt';
import { ObjectId } from 'mongodb';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '@repositories/user.repository';
import { UserType } from '@typings/user';

import { jwtConfig } from 'config/jwt';
import { BadRequestException, ForbiddenException } from '@core/error/exceptions';

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
        throw new ForbiddenException('ERROR__INVALID_CREDENTIALS');
      }
      const isPasswordValid = await this.#comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new ForbiddenException('ERROR__INVALID_CREDENTIALS');
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

  /**
   * Inserts a new user into the database and hashes the password using bcrypt.
   * Generates an auth token and refresh token that are saved in the database.
   */
  async signup(userInfo: any): Promise<UserType> {
    try {
      const { email, password, firstname, lastname, role } = userInfo;
      const hashedPassword = await this.#hashPassword(password);
      const _id = new ObjectId();
      const token = await this.#generateAuthToken(_id, role);
      const refreshToken = await this.#generateRefreshToken(_id);
      const user = await this.#userRepository.create({
        email,
        password: hashedPassword,
        firstname,
        lastname,
        role,
        tokens: [token],
        refreshToken,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      console.log('user', user);
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
