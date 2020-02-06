import { graphql } from 'react-relay';

import { renderRelayComponent } from '@golden-stack/relay-ssr';

const HomeQuery = graphql`
  query home_Home_Query($first: Int!, $search: String) {
    ...Home_query @arguments(first: $first, search: $search)
  }
`;

const Home = [
  {
    name: 'home',
    path: '/',
    getComponent: () => import('../modules/home/Home').then(m => m.default),
    query: HomeQuery,
    prepareVariables: params => ({ ...params, first: 10 }),
    render: renderRelayComponent,
  },
];

export default Home;
