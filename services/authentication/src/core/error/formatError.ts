import { GraphQLError } from 'graphql';

import logger from '../logger';
import { ErrorCodes } from './exceptions';

/**
 * Takes an error of type GraphQLError and returns a formatted error
 */

export const formatError = (error: GraphQLError) => {
  const { path = [], extensions } = error;
  logger.error(error);
  const message =
    'Function ' +
    path.join('::') +
    (extensions?.code ? '::' + extensions?.code : '') +
    (extensions?.exception?.stacktrace
      ? '::' + extensions?.exception?.stacktrace.join('').replace(/\n/g, ' ').replace(/\s\s+/g, '').replace('Error: ', '').replace(/at\s/g, ' ')
      : '');
  logger.error(message);
  // This is to avoid exposing database errors to the client
  if (error.message.toLowerCase().includes('mongo') || error.message.toLowerCase().includes('sql')) {
    error.message = 'Internal Server Error';
  }
  // Hide stack trace from client
  if (error.message.includes('Context creation failed: ') && error.extensions.code === ErrorCodes.UNAUTHORIZED) {
    error.message = error.extensions.code;
    error.extensions.exception = {
      ...error.extensions.exception,
      stacktrace: [],
    };
  }

  return error;
};
