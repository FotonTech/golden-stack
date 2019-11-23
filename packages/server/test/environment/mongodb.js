/* eslint-disable */
const MMS = require('mongodb-memory-server');
const NodeEnvironment = require('jest-environment-node');

const { default: MongodbMemoryServer } = MMS;

class MongoDbEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);

    this.mongod = new MongodbMemoryServer({
      instance: {
        // settings here
        // dbName is null, so it's random
        // dbName: MONGO_DB_NAME,
      },
      binary: {
        version: '4.2.1',
      },
      // debug: true,
      autoStart: false,
    });
  }

  async setup() {
    await super.setup();
    // console.error('\n# MongoDB Environment Setup #\n');
    await this.mongod.start();
    this.global.__MONGO_URL__ = await this.mongod.getConnectionString();
    this.global.__MONGO_DB_NAME__ = await this.mongod.getDbName();
    this.global.__COUNTERS__ = {
      event: 0,
    };
  }

  async teardown() {
    await super.teardown();
    // console.error('\n# MongoDB Environment Teardown #\n');
    await this.mongod.stop();
    this.mongod = null;
    this.global = {};
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = MongoDbEnvironment;
