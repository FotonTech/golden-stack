/* global __DEV__ */
import { installRelayDevTools } from 'relay-devtools';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
// import createRelayNetworkLogger from 'relay-runtime/lib/network/createRelayNetworkLogger';
// import RelayNetworkLoggerTransaction from 'relay-runtime/lib/network/RelayNetworkLoggerTransaction';

import cacheHandler from './cacheHandler';

if (__DEV__) {
  installRelayDevTools();
}

// TODO - rollback network logger
// const RelayNetworkLogger = createRelayNetworkLogger(RelayNetworkLoggerTransaction);
// const network = Network.create(__DEV__ ? RelayNetworkLogger.wrapFetch(cacheHandler) : cacheHandler);
const network = Network.create(cacheHandler);

const source = new RecordSource();
const store = new Store(source);

// export const inspector = new RecordSourceInspector(source);

const env = new Environment({
  network,
  store,
});

export default env;
