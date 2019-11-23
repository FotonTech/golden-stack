import React, { ComponentType, useContext, FunctionComponent } from 'react';
import hoistStatics from 'hoist-non-react-statics';
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
} from 'react-relay-network-modern';
import { Environment, RecordSource, Store } from 'relay-runtime';
import RelayServerSSR from 'react-relay-network-modern-ssr/lib/server';
import RelayClientSSR from 'react-relay-network-modern-ssr/lib/client';

type MiddlewareList = Array<Middleware | MiddlewareSync | MiddlewareRaw | null>;

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

export function createRelayEnvironment(relaySsr: RelayServerSSR | RelayClientSSR, url: string, extra?: MiddlewareList) {
  const middlewares: MiddlewareList = [
    relaySsr.getMiddleware(),
    urlMiddleware({ url, ...(BUILD === BUILD_TARGET.CLIENT ? { credentials: 'same-origin' } : {}) }),
    next => req => {
      req.fetchOpts.headers.appplatform = BUILD === BUILD_TARGET.SERVER ? PLATFORM['WEB-SSR'] : PLATFORM.WEB;
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

  return new Environment({
    network: new RelayNetworkLayer(middlewares),
    store: new Store(new RecordSource()),
  });
}

const EnvironmentContext = React.createContext<Environment | null>(null);

interface EnvironmentProviderProps {
  environment: Environment;
  children: React.ReactElement;
}

export function EnvironmentProvider({ environment, children }: EnvironmentProviderProps) {
  return <EnvironmentContext.Provider value={environment}>{children}</EnvironmentContext.Provider>;
}

export function useEnvironment() {
  const environment = useContext(EnvironmentContext);
  if (environment == null) {
    throw new Error('useEnvironment has been used outside of a <EnvironmentProvider />');
  }
  return environment;
}

export interface InjectedEnvironmentProps {
  environment: Environment;
}

export function withEnvironment<Props>(
  WrappedComponent: ComponentType<Props & InjectedEnvironmentProps>,
): ComponentType<Props> {
  const ConnectedToken: FunctionComponent<Props> = props => {
    const environment = useContext(EnvironmentContext);
    if (environment == null) {
      throw new Error('withEnvironment has been used outside of a <EnvironmentProvider />');
    }
    return <WrappedComponent {...props} environment={environment} />;
  };

  return hoistStatics(ConnectedToken, WrappedComponent);
}
