import { GraphQLID, GraphQLString, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { connectionArgs, fromGlobalId, globalIdField } from 'graphql-relay';

import { NodeField, NodesField } from '../../interface/NodeInterface';

import { GraphQLContext } from '../../types';
import * as EventLoader from '../../modules/event/EventLoader';
import EventType, { EventConnection } from '../../modules/event/EventType';

export default new GraphQLObjectType<any, GraphQLContext, any>({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    id: globalIdField('Query'),
    node: NodeField,
    nodes: NodesField,

    /* EVENT */
    event: {
      type: EventType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (_, { id }, context) => await EventLoader.load(context, fromGlobalId(id).id),
    },
    events: {
      type: GraphQLNonNull(EventConnection.connectionType),
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: async (_, args, context) => await EventLoader.loadEvents(context, args),
    },
    /* EVENT */
  }),
});
