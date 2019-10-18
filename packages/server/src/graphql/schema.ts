import { GraphQLSchema } from 'graphql';

import MutationType from './type/MutationType';
import QueryType from './type/QueryType';

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
