import { CacheConfig, UploadableMap, Variables } from 'react-relay';
import { QueryResponseCache, RequestNode } from 'relay-runtime';

import fetchQuery from './fetchQuery';
import { forceFetch, isMutation } from './helpers';

const oneMinute = 60 * 1000;
export const relayResponseCache = new QueryResponseCache({ size: 250, ttl: oneMinute });

const cacheHandler = async (
  request: RequestNode,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables: UploadableMap,
) => {
  const queryID = request.text;

  if (isMutation(request)) {
    relayResponseCache.clear();
    return fetchQuery(request, variables, cacheConfig, uploadables);
  }

  const fromCache = relayResponseCache.get(queryID, variables);
  if (fromCache !== null && forceFetch(cacheConfig) === false) {
    return fromCache;
  }

  const fromServer = await fetchQuery(request, variables, cacheConfig, uploadables);
  if (fromServer) {
    relayResponseCache.set(queryID, variables, fromServer);
  }

  return fromServer;
};

export default cacheHandler;
