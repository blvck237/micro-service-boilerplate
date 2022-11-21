import { ApolloHandler } from '@loaders/apollo';
import DataBaseHandler from '@loaders/database';
import { ApolloServer } from 'apollo-server';

describe('App', () => {
  let server: ApolloServer;
  beforeAll(async () => {
    await DataBaseHandler.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await DataBaseHandler.close();
    server?.stop();
  });

  describe('Database handler', () => {
    it('Should be able to connect to database', async () => {
      expect(DataBaseHandler.getDb()).toBeDefined();
    });
  });

  describe('Apollo handler', () => {
    it('Should be able to start apollo server', async () => {
      const apolloHandler = new ApolloHandler(Number(process.env.PORT));
      const db = DataBaseHandler.getDb();
      await apolloHandler.start(db);
      const result = await apolloHandler.server.executeOperation({
        query: 'query { ping }',
      });
      ({ server } = apolloHandler);
      expect(result.data.ping).toBe('pong');
    });
  });
});
