import { CacheConfig, RequestNode, UploadableMap, Variables } from 'relay-runtime';

export const isMutation = (request: RequestNode) => request.operationKind === 'mutation';
export const isQuery = (request: RequestNode) => request.operationKind === 'query';
export const forceFetch = (cacheConfig: CacheConfig) => !!(cacheConfig && cacheConfig.force);

export const handleData = (response: Response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json();
  }

  return response.text();
};

function getRequestBodyWithUploadables(request: RequestNode, variables: Variables, uploadables: UploadableMap) {
  const formData = new FormData();
  formData.append('name', request.name);
  formData.append('query', request.text);
  formData.append('variables', JSON.stringify(variables));

  Object.keys(uploadables).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
      formData.append(key, uploadables[key]);
    }
  });

  return formData;
}

function getRequestBodyWithoutUplodables(request: RequestNode, variables: Variables) {
  return JSON.stringify({
    name: request.name,
    query: request.text, // GraphQL text from input
    variables,
  });
}

export function getRequestBody(request: RequestNode, variables: Variables, uploadables: UploadableMap | null) {
  if (uploadables) {
    return getRequestBodyWithUploadables(request, variables, uploadables);
  }

  return getRequestBodyWithoutUplodables(request, variables);
}

export const getHeaders = (uploadables: UploadableMap | null) => {
  if (uploadables) {
    return {
      Accept: '*/*',
    };
  }

  return {
    Accept: 'application/json',
    'Content-type': 'application/json',
  };
};

export const refetch = (relay, variables = {}, callback: () => void = () => null, options = {}) => {
  const refetchVariables = fragmentVariables => ({
    ...fragmentVariables,
    ...variables,
  });

  const renderVariables = {
    ...variables,
  };

  relay.refetch(refetchVariables, renderVariables, () => callback(), options);
};
