import { MongoClient, Db } from 'mongodb';
import logger from '../core/logger';

class DataBaseHandler {
  protected db: Db;
  #client: MongoClient;

  getDb() {
    return this.db;
  }

  async connect(url: string) {
    this.#client = new MongoClient(url);
    this.#client.on('open', () => {
      logger.info('✅ Connected to database');
    });
    await this.#client.connect();
    this.db = this.#client.db();
  }
}

export default new DataBaseHandler();