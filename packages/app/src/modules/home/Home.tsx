import React from 'react';
import {Text} from 'react-native';

import {graphql, createRefetchContainer, RelayProp} from 'react-relay';

import styled from 'styled-components';

import {Home_query} from './__generated__/Home_query.graphql';
import {createQueryRenderer} from '@golden-stack/relay-app';

const TOTAL_REFETCH_ITEMS = 10;

const Wrapper = styled.ScrollView`
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

interface Props {
  query: Home_query;
  relay: RelayProp;
}

const Home = (_: Props) => {
  return (
    <Wrapper>
      <Text>Golden Stack Home</Text>
    </Wrapper>
  );
};

const HomeRefetchContainer = createRefetchContainer(
  Home,
  {
    query: graphql`
      fragment Home_query on Query
        @argumentDefinitions(
          first: {type: "Int!", defaultValue: 10}
          search: {type: String}
        ) {
        events(first: $first, search: $search)
          @connection(key: "Home_events", filters: []) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
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

export default createQueryRenderer(HomeRefetchContainer, Home, {
  query: graphql`
    query HomeQuery($first: Int!, $search: String!) {
      ...Home_query
    }
  `,
  variables: {first: TOTAL_REFETCH_ITEMS},
});
