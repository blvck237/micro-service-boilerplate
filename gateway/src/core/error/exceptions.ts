/* eslint-disable max-classes-per-file */
import { ApolloError } from 'apollo-server-errors';
import { GraphQLError } from 'graphql';

export enum ErrorCodes {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL = 'INTERNAL_SERVER_ERROR',
  CONFLICT = 'CONFLICT',
  NOT_FOUND = 'NOT_FOUND',
}

type Extensions = {
  fields: Record<string, any>;
};

class BadRequestException extends ApolloError {
  constructor(message: string, extenstions?: Extensions) {
    super(message, ErrorCodes.BAD_REQUEST, extenstions);
  }
}

class UnauthorizedException extends ApolloError {
  constructor(message: string) {
    super(message, ErrorCodes.UNAUTHORIZED);
  }
}

class InternalServerException {
  constructor(message: ApolloError | string) {
    if (typeof message === 'string') {
      throw new ApolloError(message, ErrorCodes.INTERNAL);
    }
    throw message;
  }
}

class AlreadyExistException extends ApolloError {
  constructor(message: string) {
    super(message, ErrorCodes.CONFLICT);
  }
}

class ForbiddenException extends ApolloError {
  constructor(message: string) {
    super(message, ErrorCodes.FORBIDDEN);
  }
}

export { BadRequestException, UnauthorizedException, InternalServerException, AlreadyExistException, ForbiddenException };
