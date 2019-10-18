import { getDataloaders } from '../src/graphql/helper';

import * as graphqlLoaders from '../src/loader';
import { GraphQLContext } from '../src/types';

export const getContext = async (ctx = {}): Promise<GraphQLContext> => {
  const context = {
    ...ctx,
  };

  const dataloaders = getDataloaders(graphqlLoaders);

  return {
    req: {},
    dataloaders,
    koaContext: {
      request: {
        ip: '::ffff:127.0.0.1',
      },
      cookies: {
        set: jest.fn(),
      },
    },
    ...context,
  };
};
