import { Environment, Network, RecordSource, Store } from 'relay-runtime';
// import { createRelayNetworkLogger, RelayNetworkLoggerTransaction } from 'relay-runtime';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import executeFunction from './cacheHandler';

const websocketURL = `ws://${process.env.GRAPHQL_URL}/subscriptions` || 'ws://localhost:5001/subscriptions';
const setupSubscription = (config, variables, cacheConfig, observer) => {
  const query = config.text;
  const subscriptionClient = new SubscriptionClient(websocketURL, { reconnect: true });
  subscriptionClient.subscribe({ query, variables }, (error, result) => {
    observer.onNext({ data: result });
  });
};

// TODO - rollback network logger
// const RelayNetworkLogger = createRelayNetworkLogger(RelayNetworkLoggerTransaction);
// const network = Network.create(
//   process.env.NODE_ENV === 'development' ? RelayNetworkLogger.wrapFetch(executeFunction) : executeFunction,
//   setupSubscription,
// );
const network = Network.create(executeFunction, setupSubscription);

const source = new RecordSource();
const store = new Store(source);

const env = new Environment({
  network,
  store,
});

export default env;
