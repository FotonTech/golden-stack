import React from 'react';

import { RouterState } from 'found';
import { graphql, createRefetchContainer, RelayProp } from 'react-relay';

import styled from 'styled-components';

import { Home_query } from './__generated__/Home_query.graphql';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  min-height: calc(100vh - 270px);
  padding-bottom: 50px;
  background: white;
  overflow: hidden;
`;

interface Props extends RouterState {
  query: Home_query;
  relay: RelayProp;
}

const Home = (props: Props) => {
  const { query } = props;

  // eslint-disable-next-line no-console
  console.log('query', query);

  return (
    <Wrapper>
      <span>Golden Stack Home</span>
    </Wrapper>
  );
};

export default createRefetchContainer(
  Home,
  {
    query: graphql`
      fragment Home_query on Query
        @argumentDefinitions(first: { type: "Int!", defaultValue: 10 }, search: { type: String }) {
        events(first: $first, search: $search) @connection(key: "Home_events", filters: []) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              description
            }
          }
        }
      }
    `,
  },
  graphql`
    query HomeRefetchQuery($first: Int!, $search: String) {
      ...Home_query @arguments(first: $first, search: $search)
    }
  `,
);
