import { fromGlobalId } from 'graphql-relay';

import Event, * as EventLoader from '../modules/event/EventLoader';
import EventType from '../modules/event/EventType';
import { GraphQLContext } from '../types';

import { nodeDefinitions } from './node';

const { nodeField, nodesField, nodeInterface } = nodeDefinitions(
  // A method that maps from a global id to an object
  async (globalId, context: GraphQLContext) => {
    const { id, type } = fromGlobalId(globalId);

    if (type === 'Event') {
      return EventLoader.load(context, id);
    }

    // it should not get here
    return null;
  },
  // A method that maps from an object to a type
  obj => {
    if (obj instanceof Event) {
      return EventType;
    }

    // it should not get here
    return null;
  },
);

export const NodeInterface = nodeInterface;
export const NodeField = nodeField;
export const NodesField = nodesField;
