import '../../utils/env';

import mongoose from 'mongoose';

import debug from '../../utils/debug.util';

const log: debug.IDebugger = debug('app:mongoose-service');

/**
 * MongooseService
 * MongoDB service
 * @class MongooseService
 */
class MongooseService {
  mongooseOptions = {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    // useFindAndModify: false,
  };

  retrySeconds = 5;

  retryCount = 0;

  constructor() {
    this.connectWithRetry = this.connectWithRetry.bind(this);
    this.connectWithRetry();
  }

  /**
   * getMongoose
   * Return mongoose service
   * @returns
   * @memberof MongooseService
   */
  getMongoose() {
    return mongoose;
  }

  /**
   * connectWithRetry
   * Attempt MongoDB connection with retry on fail
   * @memberof MongooseService
   */
  connectWithRetry() {
    log('Attempting MongoDB connection (auto retry)');
    mongoose
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .connect(process.env.DB_URL!, this.mongooseOptions)
      .then(() => {
        log('MongoDB is connected');
      })
      .catch((error) => {
        log(
          `MongoDB connection unsuccessful (will retry ${(this.retryCount += 1)} after ${
            this.retrySeconds
          } seconds): %O`,
          error,
        );
        setTimeout(this.connectWithRetry, this.retrySeconds * 1000);
      });
  }
}

export default new MongooseService();
