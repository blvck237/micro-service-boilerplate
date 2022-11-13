import { UnauthorizedException } from '@core/error/exceptions';

const publicResolvers = Object.freeze(['Login', 'SignUp']);

const resolverIsPublic = ({ query }) => publicResolvers.includes(query);
const isIntrospectionQuery = ({ operationName }) => operationName === 'IntrospectionQuery';
const shouldAuthenticate = (body) => !isIntrospectionQuery(body) && !resolverIsPublic(body);

export const authUser = async ({ req }) => {
  const { authorization } = req.headers;
  if (shouldAuthenticate(req.body)) {
    if (!authorization) {
      throw new UnauthorizedException('NO_TOKEN');
    }

    // TODO Auth user
    return {
      user: {
        _id: 1,
        name: 'John Doe',
        email: 'john.doe@gmail.com',
      },
    };
  }
};
