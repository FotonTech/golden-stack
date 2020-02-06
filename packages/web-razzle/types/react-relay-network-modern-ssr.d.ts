/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-duplicates */

declare module 'react-relay-network-modern-ssr/node8/server' {
  import { Middleware } from 'react-relay-network-modern/node8';
  import { ExecutionResult, GraphQLFieldResolver, GraphQLSchema } from 'graphql';

  export type SSRCache = [string, ExecutionResult][];

  export interface SSRGraphQLArgs {
    schema: GraphQLSchema;
    rootValue?: any;
    contextValue?: any;
    operationName?: string;
    fieldResolver?: GraphQLFieldResolver<any, any>;
  }

  export default class RelayServerSSR {
    cache: Map<string, Promise<ExecutionResult>>;
    debug: boolean;

    constructor();
    getMiddleware(args?: SSRGraphQLArgs | (() => Promise<SSRGraphQLArgs>)): Middleware;
    getCache(): Promise<SSRCache>;
    log(...args: any): void;
  }
}

declare module 'react-relay-network-modern-ssr/node8/client' {
  import { MiddlewareSync, QueryPayload } from 'react-relay-network-modern/node8';

  import { SSRCache } from './server';

  export interface RelayClientSSRMiddlewareOpts {
    lookup?: boolean;
  }

  export default class RelayClientSSR {
    cache: Map<string, QueryPayload>;
    debug: boolean;

    constructor(cache?: SSRCache);
    getMiddleware(opts?: RelayClientSSRMiddlewareOpts): MiddlewareSync;
    clear(): void;
    log(...args: any): void;
  }
}
