import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import Event from '../EventModel';

import * as EventLoader from '../EventLoader';
import { EventConnection } from '../EventType';

interface EventAddArgs {
  title: string;
  description: string;
  address: string;
  date: string;
}

const mutation = mutationWithClientMutationId({
  name: 'EventAdd',
  inputFields: {
    title: {
      type: GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLNonNull(GraphQLString),
    },
    address: {
      type: GraphQLString,
    },
    date: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async (args: EventAddArgs) => {
    const { title, description, address, date } = args;

    const newEvent = await new Event({
      title,
      description,
      address,
      date,
    }).save();

    return {
      id: newEvent._id,
      error: null,
    };
  },
  outputFields: {
    eventEdge: {
      type: EventConnection.edgeType,
      resolve: async ({ id }, _, context) => {
        const newEvent = await EventLoader.load(context, id);

        // Returns null if no node was loaded
        if (!newEvent) {
          return null;
        }

        return {
          cursor: toGlobalId('Event', newEvent._id),
          node: newEvent,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export default {
  ...mutation,
};
