import { GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../graphql/connection/CustomConnectionType';

import { NodeInterface } from '../../interface/NodeInterface';

import { GraphQLContext } from '../../types';

import Event from './EventLoader';

type ConfigType = GraphQLObjectTypeConfig<Event, GraphQLContext>;

const EventTypeConfig: ConfigType = {
  name: 'Event',
  description: 'Represents Event',
  fields: () => ({
    id: globalIdField('Event'),
    _id: {
      type: GraphQLNonNull(GraphQLString),
      description: 'MongoDB _id',
      resolve: event => event._id.toString(),
    },
    title: {
      type: GraphQLString,
      resolve: event => event.title,
    },
    description: {
      type: GraphQLString,
      resolve: event => event.description,
    },
    address: {
      type: GraphQLNonNull(GraphQLString),
      resolve: event => event.address,
    },
    date: {
      type: GraphQLString,
      resolve: event => (event.date ? event.date.toISOString() : null),
    },
    createdAt: {
      type: GraphQLString,
      resolve: ({ createdAt }) => (createdAt ? createdAt.toISOString() : null),
    },
    updatedAt: {
      type: GraphQLString,
      resolve: ({ createdAt }) => (createdAt ? createdAt.toISOString() : null),
    },
  }),
  interfaces: () => [NodeInterface],
};

const EventType = new GraphQLObjectType(EventTypeConfig);

export const EventConnection = connectionDefinitions({
  name: 'Event',
  nodeType: GraphQLNonNull(EventType),
});

export default EventType;
