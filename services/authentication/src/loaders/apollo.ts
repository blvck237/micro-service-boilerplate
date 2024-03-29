import { ApolloServer, gql } from 'apollo-server-express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Db } from 'mongodb';
import * as express from 'express';
import * as passport from 'passport';
import { buildSubgraphSchema } from '@apollo/federation';

// Post resolvers
import { login } from '@resolvers/authentication/login';
import logger from '@core/logger';
import { formatError } from '@core/error/formatError';
import { signUp } from '@resolvers/authentication/signUp';

import { initPassportStrategies } from '@core/passport';
import { UserRepository } from '@repositories/user.repository';
import { CollectionsEnum } from '@typings/db';
import { scalarResolvers, scalarTypeDefs } from '@core/scalars';
import { getUserFromToken } from '@resolvers/authentication/getUserFromToken';

const resolvers = {
  Query: {
    ping: () => 'pong',
    getUserFromToken,
  },
  Mutation: {
    login,
    signUp,
  },
  ...scalarResolvers,
};

// Convert scalarTypeDefs to documentNode

const typePaths = join(__dirname, `../gql/${process.env.SERVICE_NAME}.gql`);
const gqlTypes = readFileSync(typePaths).toString();
const typeDefs = gql`
  ${gqlTypes}
`;
const scalarTypeDefsDocumentNode = gql(scalarTypeDefs.toString());
export class ApolloHandler {
  server: ApolloServer;
  #port: number;

  constructor(port: number) {
    this.#port = port;
  }

  async start(db: Db) {
    initPassportStrategies(new UserRepository(db, CollectionsEnum.USERS));
    this.server = new ApolloServer({
      schema: buildSubgraphSchema({
        typeDefs: [scalarTypeDefsDocumentNode, typeDefs],
        resolvers,
      }),
      context: ({ req }) => ({ user: req?.headers?.['user'] ? JSON.parse(req?.headers?.['user']) : null }),
      formatError,
      logger,
    });
    const app = express();
    app.use(passport.initialize());
    await this.server.start();
    this.server.applyMiddleware({ app, path: '/' });
    app.listen({ port: this.#port });
    logger.info(`✅ Apollo server started: ${this.#port}`);
  }
}
