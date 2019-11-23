import { CacheConfig, RequestNode, UploadableMap, Variables } from 'relay-runtime';

import fetchWithRetries from './fetchWithRetries';

import { getHeaders, getRequestBody, handleData, isMutation } from './helpers';

export const PLATFORM = {
  APP: 'APP',
  WEB: 'WEB',
};

// Define a function that fetches the results of a request (query/mutation/etc)
// and returns its results as a Promise:
const fetchQuery = async (
  request: RequestNode,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables: UploadableMap | null,
) => {
  const body = getRequestBody(request, variables, uploadables);
  const token = localStorage.getItem('token');

  const headers = {
    appplatform: PLATFORM.WEB,
    ...getHeaders(uploadables),
    authorization: token ? `JWT ${token}` : null,
  };

  try {
    const response = await fetchWithRetries(process.env.GRAPHQL_URL, {
      method: 'POST',
      headers,
      body,
      fetchTimeout: 20000,
      retryDelays: [1000, 3000, 5000],
    });

    const data = await handleData(response);

    if (isMutation(request) && data.errors) {
      throw data;
      // sink.error(data);

      // if (complete) {
      //   sink.complete();
      // }

      // throw data;
    }

    // TODO - improve GraphQL Error handler
    // https://github.com/1stdibs/relay-mock-network-layer/pull/6
    // if (response.status === 200 && Array.isArray(data.errors) && data.errors.length > 0) {
    //   sink.error(data.errors, true);
    //   sink.complete();
    //   return;
    // }

    if (!data.data) {
      throw data.errors;
      // sink.error(data.errors);
      // sink.complete();
      // return;
    }

    // sink.next(data);
    // sink.next({
    //   operation: request.operation,
    //   variables,
    //   response: data,
    // });

    // if (complete) {
    //   sink.complete();
    // }

    return data;
    // return {
    //   operation: request.operation,
    //   variables,
    //   response: data,
    // };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('err:', err);

    // TODO - handle no successful response after
    const timeoutRegexp = new RegExp(/Still no successful response after/);
    const serverUnavailableRegexp = new RegExp(/Failed to fetch/);
    if (timeoutRegexp.test(err.message) || serverUnavailableRegexp.test(err.message)) {
      throw new Error('Serviço indisponível. Tente novamente mais tarde.');
      // sink.error(new Error('Serviço indisponível. Tente novamente mais tarde.'));

      // throw new Error('Serviço indisponível. Tente novamente mais tarde.');
    }

    throw err;
    // sink.error(err);
    // throw err;
  }
};

export default fetchQuery;
