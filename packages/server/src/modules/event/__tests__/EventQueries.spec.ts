import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { schema } from '../../../graphql/schema';

import {
  clearDbAndRestartCounters,
  connectMongoose,
  createEvent,
  disconnectMongoose,
  getContext,
  sanitizeTestObject,
} from '../../../../test/helpers';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('EventType queries', () => {
  it('should query an event', async () => {
    const event = await createEvent();

    // language=GraphQL
    const query = `
      query Q($id: ID) {
        event: node(id: $id) {
          id
          ... on Event {
            id
            title
            description
          }
        }
      }
    `;

    const variables = {
      id: toGlobalId('Event', event._id),
    };
    const rootValue = {};
    const context = await getContext();
    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.errors).toBeUndefined();
    expect(sanitizeTestObject(result)).toMatchSnapshot();
  });

  it('should query all events', async () => {
    await createEvent();
    await createEvent();
    await createEvent();
    await createEvent();
    await createEvent();

    // language=GraphQL
    const query = `
      query Q {
        events(first: 10) {
          edges {
            node {
              id
              title
              description
            }
          }
        }
      }
    `;

    const variables = {};
    const rootValue = {};
    const context = await getContext();
    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.errors).toBeUndefined();
    expect(sanitizeTestObject(result)).toMatchSnapshot();
  });

  it('should search all events', async () => {
    await createEvent({ description: 'desc one' });
    await createEvent({ title: 'title one' });
    await createEvent({ description: 'three' });
    await createEvent({ description: 'two' });
    await createEvent({ title: 'title two' });

    // language=GraphQL
    const query = `
      query Q {
        events(first: 10, search: "two") {
          edges {
            node {
              id
              title
              description
            }
          }
        }
      }
    `;

    const variables = {};
    const rootValue = {};
    const context = await getContext();
    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.errors).toBeUndefined();
    expect(sanitizeTestObject(result)).toMatchSnapshot();
  });
});
