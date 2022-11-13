import { join } from 'path';
import { readFileSync } from 'fs';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server';
import logger from '@core/logger';
import { authUser } from '@middlewares/authentication';
import { formatError } from '@core/error/formatError';

const supergraphPath = join(__dirname, '../supergraph.gql');

const supergraphSdl = readFileSync(supergraphPath).toString();

export const gateway = new ApolloGateway({
  supergraphSdl,
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        request?.http?.headers.set('user', JSON.stringify(context.user));
      },
    });
  },
});

const server = new ApolloServer({
  gateway,
  formatError,
  logger,
  context: authUser,
});

const main = async () => {
  try {
    const { url } = await server.listen({ port: process.env.PORT });
    logger.info(`🚀 Gateway ready at ${url}`);
  } catch (error) {
    logger.error('error', error);
  }
};

main();
