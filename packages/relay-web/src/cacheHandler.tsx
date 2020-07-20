import { Variables } from 'react-relay';
import { QueryResponseCache, RequestParameters, CacheConfig, UploadableMap } from 'relay-runtime';

import fetchQuery from './fetchQuery';
import { forceFetch, isMutation } from './helpers';

const oneMinute = 60 * 1000;
export const relayResponseCache = new QueryResponseCache({ size: 250, ttl: oneMinute });

const cacheHandler = async (
  request: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables?: UploadableMap | null,
) => {
  const queryID = request.text as string;

  if (isMutation(request)) {
    relayResponseCache.clear();
    return fetchQuery(request, variables, cacheConfig, uploadables);
  }

  const fromCache = relayResponseCache.get(queryID, variables);
  if (fromCache !== null && !forceFetch(cacheConfig)) {
    return fromCache;
  }

  const fromServer = await fetchQuery(request, variables, cacheConfig, uploadables);
  if (fromServer) {
    relayResponseCache.set(queryID, variables, fromServer);
  }

  return fromServer;
};

export default cacheHandler;
