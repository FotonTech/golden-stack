import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { RelayEnvironmentProvider } from 'react-relay/hooks';

import { Environment } from '@golden-stack/relay-web';

import App from './App';
const rootEl = document.getElementById('root');

if (rootEl) {
  ReactDOM.render(
    <RelayEnvironmentProvider environment={Environment}>
      <App />
    </RelayEnvironmentProvider>,
    rootEl,
  );
} else {
  throw new Error('wrong rootEl');
}
