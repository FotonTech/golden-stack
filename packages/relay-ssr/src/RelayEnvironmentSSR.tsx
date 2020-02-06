// eslint-disable-next-line import/no-unresolved
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';

import {
  RelayNetworkLayer,
  urlMiddleware,
  loggerMiddleware,
  errorMiddleware,
  perfMiddleware,
  cacheMiddleware,
  retryMiddleware,
  Middleware,
  MiddlewareSync,
  MiddlewareRaw,
} from 'react-relay-network-modern/node8';
import { Environment, RecordSource, Store } from 'relay-runtime';
import RelayServerSSR from 'react-relay-network-modern-ssr/node8/server';
import RelayClientSSR from 'react-relay-network-modern-ssr/node8/client';

import { version } from '../package.json';

type MiddlewareList = Array<Middleware | MiddlewareSync | MiddlewareRaw | null>;

let relayEnvironment = null;

const BUILD = process.env.BUILD_TARGET;

export const PLATFORM = {
  WEB: 'WEB',
  'WEB-SSR': 'WEB-SSR',
} as const;

export const BUILD_TARGET = {
  CLIENT: 'client',
  SERVER: 'server',
} as const;

const oneMinute = 60 * 1000;

export function createRelayEnvironmentSsr(
  relaySsr: RelayServerSSR | RelayClientSSR,
  url: string,
  extra?: MiddlewareList,
  appVersion: string = version,
) {
  const middlewares: MiddlewareList = [
    relaySsr.getMiddleware(),
    urlMiddleware({ url, ...(BUILD === BUILD_TARGET.CLIENT ? { credentials: 'same-origin' } : {}) }),
    next => req => {
      req.fetchOpts.headers.appplatform = BUILD === BUILD_TARGET.SERVER ? PLATFORM['WEB-SSR'] : PLATFORM.WEB;
      req.fetchOpts.headers.appversion = appVersion;
      req.fetchOpts.headers.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return next(req);
    },
  ];

  if (extra) {
    middlewares.push(...extra);
  }

  if (BUILD === BUILD_TARGET.CLIENT) {
    if (process.env.NODE_ENV === 'development') {
      middlewares.push(loggerMiddleware());
      middlewares.push(errorMiddleware());
      middlewares.push(perfMiddleware());
    }
    middlewares.push(
      cacheMiddleware({
        size: 250,
        ttl: oneMinute,
        clearOnMutation: true,
      }),
    );
    middlewares.push(
      retryMiddleware({
        fetchTimeout: 20000,
        retryDelays: [1000, 3000, 5000],
        beforeRetry: ({ abort, attempt }) => {
          if (attempt > 5) abort();
          // window.forceRelayRetry = forceRetry;
          // console.log('call `forceRelayRetry()` for immediately retry! Or wait ' + delay + ' ms.');
        },
        statusCodes: [500, 501, 502, 503, 504],
      }),
    );
  }

  const network = new RelayNetworkLayer(middlewares);
  const source = new RecordSource();
  const store = new Store(source);

  // Make sure to create a new Relay Environment for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return new Environment({
      network,
      store,
    });
  }

  // Reuse Relay environment on client-side
  if (!relayEnvironment) {
    relayEnvironment = new Environment({
      network,
      store,
    });
  }

  return relayEnvironment;
}
