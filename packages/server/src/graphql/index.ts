import 'core-js';
import { createServer } from 'http';

import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import { GRAPHQL_PORT } from '../common/config';
import connectDatabase from '../common/database';

import app from './app';
import { schema } from './schema';

const runServer = async () => {
  try {
    // eslint-disable-next-line no-console
    console.log('connecting to database...');
    await connectDatabase();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Could not connect to database', { error });
    throw error;
  }

  const server = createServer(app.callback());

  server.listen(GRAPHQL_PORT, () => {
    // eslint-disable-next-line no-console
    console.info(`Server started on port: ${GRAPHQL_PORT}`);

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info(`GraphQL Playground available at /playground on port ${GRAPHQL_PORT}`);
    }

    SubscriptionServer.create(
      {
        // eslint-disable-next-line no-console
        onDisconnect: () => console.info('Client subscription disconnected'),
        execute,
        subscribe,
        schema,

        // eslint-disable-next-line no-console
        onConnect: connectionParams => console.info('Client subscription connected', connectionParams),
      },
      {
        server,
        path: '/subscriptions',
      },
    );
  });
};

(async () => {
  // eslint-disable-next-line no-console
  console.log('server starting...');
  await runServer();
})();
