import 'core-js/stable';
import 'regenerator-runtime/runtime';

import BrowserProtocol from 'farce/lib/BrowserProtocol';
import createInitialFarceRouter from 'found/lib/createInitialFarceRouter';
import { Resolver } from 'found-relay';
import React from 'react';
import ReactDOM from 'react-dom';
import RelayClientSSR from 'react-relay-network-modern-ssr/node8/client';
import { RelayEnvironmentProvider } from 'react-relay/hooks';

import { createRelayEnvironmentSsr } from '@golden-stack/relay-ssr';

import { historyMiddlewares, render, routeConfig } from './router/router';

(async () => {
  const environment = createRelayEnvironmentSsr(new RelayClientSSR(window.__RELAY_PAYLOADS__), '/graphql');
  const resolver = new Resolver(environment);

  const Router = await createInitialFarceRouter({
    historyProtocol: new BrowserProtocol(),
    historyMiddlewares,
    routeConfig,
    resolver,
    render,
  });

  ReactDOM.hydrate(
    <RelayEnvironmentProvider environment={environment}>
      <Router resolver={resolver} />
    </RelayEnvironmentProvider>,
    document.getElementById('root'),
  );
})();
