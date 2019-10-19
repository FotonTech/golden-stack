import React from 'react';
import {SafeAreaView, StatusBar, View, Text} from 'react-native';

import {graphql, createRefetchContainer, RelayProp} from 'react-relay';

import {Home_query} from './__generated__/Home_query.graphql';
import {createQueryRenderer} from '@golden-stack/relay-app';

const TOTAL_REFETCH_ITEMS = 10;

interface Props {
  query: Home_query;
  relay: RelayProp;
}

const Home = (_: Props) => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View>
          <Text>Golden Stack Home</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Home;

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
    query HomeQuery($first: Int!, $search: String) {
      ...Home_query @arguments(first: $first, search: $search)
    }
  `,
  variables: {first: TOTAL_REFETCH_ITEMS},
});
