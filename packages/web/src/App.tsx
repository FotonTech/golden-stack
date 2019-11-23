import React from 'react';
import { hot } from 'react-hot-loader/root';
import { graphql, createRefetchContainer } from 'react-relay';

import { createQueryRenderer } from '@golden-stack/relay-web';

import SEO from './SEO';
import placeholder from './assets/placeholder.png';

import { App_query } from './__generated__/App_query.graphql';

type Props = {
  query: App_query;
};

const App = ({ query }: Props) => {
  const { events } = query;

  const renderItem = ({ node }) => {
    return (
      <>
        <span>{node.title}</span>
        <br />
      </>
    );
  };

  return (
    <div>
      <SEO
        title={'Event Title'}
        description={'Event Description'}
        imageUrl={placeholder}
        url={'/'}
        label1={'Date'}
        data1={Date.now().toString()}
        label2={'Where'}
        data2={'Rua xyz, Floripa'}
      />
      <span>Golden Stack</span>
      <br />
      {events && Array.isArray(events.edges) && events.edges.length > 0
        ? events.edges.map(item => renderItem(item))
        : null}
    </div>
  );
};

const AppRefetchContainer = createRefetchContainer(
  App,
  {
    query: graphql`
      fragment App_query on Query @argumentDefinitions(first: { type: Int }, search: { type: String }) {
        events(first: $first, search: $search) @connection(key: "App_events", filters: []) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
            }
          }
        }
      }
    `,
  },
  graphql`
    query AppRefetchQuery($first: Int, $search: String) {
      ...App_query @arguments(first: $first, search: $search)
    }
  `,
);

export default hot(
  createQueryRenderer(AppRefetchContainer, App, {
    query: graphql`
      query AppQuery($first: Int, $search: String) {
        ...App_query @arguments(first: $first, search: $search)
      }
    `,
    variables: { first: 10 },
  }),
);
