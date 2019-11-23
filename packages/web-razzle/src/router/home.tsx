import { graphql } from 'react-relay';

import { HomeRefetchContainer } from '../modules/home/Home';

import { composeFragmentsToComponent } from '../relay/utils';

const HomeQuery = graphql`
  query home_Home_Query($first: Int!, $search: String) {
    ...Home_query @arguments(first: $first, search: $search)
  }
`;

const Home = [
  {
    name: 'home',
    path: '/',
    Component: composeFragmentsToComponent('Home', HomeRefetchContainer),
    query: HomeQuery,
    prepareVariables: params => ({ ...params, first: 10 }),
  },
];

export default Home;
