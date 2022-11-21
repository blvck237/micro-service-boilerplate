import fetch from 'node-fetch';
import * as fs from 'fs';
import { UnauthorizedException, InternalServerException } from '@core/error/exceptions';

const publicResolvers = Object.freeze(['login', 'signUp']);
// Check if query contains a public resolver
const resolverIsPublic = ({ query }) => {
  for (const resolver of publicResolvers) {
    if (query.includes(resolver)) {
      return true;
    }
  }
  return false;
};
const isIntrospectionQuery = ({ operationName }) => operationName === 'IntrospectionQuery';

export const authUser = async ({ req }) => {
  const { authorization } = req.headers;
  if (isIntrospectionQuery(req.body) || resolverIsPublic(req.body)) return { user: null };
  if (!authorization) {
    throw new UnauthorizedException('NO_TOKEN');
  }

  const query = `
      query GetUserFromToken {
        getUserFromToken(token: "${authorization.split(' ')[1]}") {
          _id
          email
          firstname
          lastname
          role
          createdAt
          updatedAt
          token
          refreshToken
        }
      }
    `;
  try {
    const response = await fetch(`${process.env.AUTH_SERVICE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    const result = await response.json();
    if (result.errors) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    return {
      user: result.data.getUserFromToken,
    };
  } catch (error) {
    throw new InternalServerException(error);
  }
};
