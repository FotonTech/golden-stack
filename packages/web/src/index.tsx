import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { RelayEnvironmentProvider } from 'react-relay/hooks';

import App from './App';

import RelayEnvironment from './RelayEnvironment';
// import routes from './routes';
// import RoutingContext from './routing/RoutingContext';
// import createRouter from './routing/createRouter';
// import RouterRenderer from './routing/RouteRenderer';

// Uses the custom router setup to define a router instance that we can pass through context
// const router = createRouter(routes);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RelayEnvironmentProvider environment={RelayEnvironment}>
    <App />
  </RelayEnvironmentProvider>,
);

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <RelayEnvironmentProvider environment={RelayEnvironment}>
//     <RoutingContext.Provider value={router.context}>
//       {/* Render the active route */}
//       <RouterRenderer />
//       </RoutingContext.Provider>
//   </RelayEnvironmentProvider>,
// );
