import 'core-js/stable';
import 'regenerator-runtime/runtime';

import BrowserProtocol from 'farce/lib/BrowserProtocol';
import createInitialFarceRouter from 'found/lib/createInitialFarceRouter';
import { Resolver } from 'found-relay';
import React from 'react';
import ReactDOM from 'react-dom';
import RelayClientSSR from 'react-relay-network-modern-ssr/lib/client';

import { createRelayEnvironment, EnvironmentProvider } from './relay/Environment';
import { historyMiddlewares, render, routeConfig } from './router/router';

(async () => {
  const environment = createRelayEnvironment(
    // eslint-disable-next-line no-underscore-dangle
    new RelayClientSSR(window.__RELAY_PAYLOADS__),
    '/graphql',
  );
  const resolver = new Resolver(environment);

  const Router = await createInitialFarceRouter({
    historyProtocol: new BrowserProtocol(),
    historyMiddlewares,
    routeConfig,
    resolver,
    render,
  });

  ReactDOM.hydrate(
    <EnvironmentProvider environment={environment}>
      <Router resolver={resolver} />
    </EnvironmentProvider>,
    document.getElementById('root'),
  );
})();
