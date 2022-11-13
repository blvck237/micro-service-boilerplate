import { ApolloServer, gql } from 'apollo-server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { buildSubgraphSchema } from '@apollo/federation';
// Post resolvers
import { createPost } from '../resolvers/post/createPost';
import { postList } from '../resolvers/post/postList';
import logger from '../core/logger';
import { formatError } from '../core/error/formatError';

const resolvers = {
  Query: {
    postList,
  },
  Mutation: {
    createPost,
  },
};

const typePaths = join(__dirname, `../gql/${process.env.SERVICE_NAME}.gql`);
const gqlTypes = readFileSync(typePaths).toString();
const typeDefs = gql(gqlTypes);

export class ApolloHandler {
  server: ApolloServer;
  #port: number;

  constructor(port: number) {
    this.#port = port;
  }
  async start() {
    this.server = new ApolloServer({
      schema: buildSubgraphSchema({ typeDefs, resolvers }),
      context: ({ req }) => ({ user: JSON.parse(req.headers['user']) }),
      formatError,
      logger,
    });
    const { url } = await this.server.listen({ port: this.#port });
    logger.info(`✅ Apollo server started: ${url}`);
  }
}
