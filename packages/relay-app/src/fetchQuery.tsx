import { Platform } from 'react-native';
// import { GRAPHQL_URL } from 'react-native-dotenv';
import { RequestNode, UploadableMap, Variables } from 'relay-runtime';

import fetchWithRetries from './fetchWithRetries';
import { getHeaders, getRequestBody, handleData, isMutation } from './helpers';

const GRAPHQL_URL = 'http://localhost:5001/graphql';

// Define a function that fetches the results of a request (query/mutation/etc)
// and returns its results as a Promise:
const fetchQuery = async (request: RequestNode, variables: Variables, uploadables: UploadableMap) => {
  try {
    const body = getRequestBody(request, variables, uploadables);

    const headers = {
      // appversion: Globals.APP_VERSION,
      // appbuild: Globals.APP_BUILD,
      appplatform: `${Platform.OS}-${Platform.Version}`,
      ...getHeaders(uploadables),
    };

    const response = await fetchWithRetries(GRAPHQL_URL, {
      method: 'POST',
      headers,
      body,
      fetchTimeout: 20000,
      retryDelays: [1000, 3000, 5000],
    });

    const data = await handleData(response);

    if (response.status === 401) {
      throw data.errors;
    }

    if (isMutation(request) && data.errors) {
      throw data;
    }

    if (!data.data) {
      throw data.errors;
    }

    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('err: ', err);

    const timeoutRegexp = new RegExp(/Still no successful response after/);
    const serverUnavailableRegexp = new RegExp(/Failed to fetch/);
    if (timeoutRegexp.test(err.message) || serverUnavailableRegexp.test(err.message)) {
      // sink.error(new Error('Serviço indisponível. Tente novamente mais tarde.'));

      throw new Error('Unavailable service. Try again later');
    }

    // sink.error(err);
    throw err;
  }
};

export default fetchQuery;
