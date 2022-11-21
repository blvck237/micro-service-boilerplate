import logger from '@core/logger';
import { ApolloHandler } from '@loaders/apollo';
import DataBaseHandler from '@loaders/database';

const main = async () => {
  try {
    const apolloHandler = new ApolloHandler(Number(process.env.PORT));
    await DataBaseHandler.connect('mongodb://localhost:27017/ms-db-auth');
    const db = DataBaseHandler.getDb();
    await apolloHandler.start(db);
    logger.info(`🚀 ${process.env.SERVICE_NAME} service launched`);
  } catch (error) {
    logger.error(error);
  }
};

main();
