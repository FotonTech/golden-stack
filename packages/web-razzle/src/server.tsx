import 'isomorphic-fetch';

import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import koaLogger from 'koa-logger';
import proxy from 'koa-better-http-proxy';
import { RelayEnvironmentProvider } from 'react-relay/hooks';

import React from 'react';

import { renderToString } from 'react-dom/server';
import { getFarceResult } from 'found/lib/server';
import { Resolver } from 'found-relay';

import RelayServerSSR, { SSRCache } from 'react-relay-network-modern-ssr/node8/server';
import { ServerStyleSheet } from 'styled-components';

import { createRelayEnvironmentSsr } from '@golden-stack/relay-ssr';

import { version } from '../package.json';

import { GRAPHQL_URL, sessionCookieName } from './config';

import { historyMiddlewares, routeConfig, render } from './router/router';
import { NotFound } from './middlewares';
import indexHtml from './index.html';
import { removeCookie } from './utils';

// We cant use env-var here as this is defined by razzle on build-time
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);

const router = new Router();

// do not allow get on /graphql
router.get('/graphql', NotFound);

// enable post on /graphql
const url = new URL(GRAPHQL_URL);
if (url.pathname !== '/graphql') {
  throw new Error('Does not support GRAPHQL_URL with pathname different than /graphql');
} else {
  router.post('/graphql', proxy(GRAPHQL_URL, {}));
}

// Simplify relay data returned by 'react-relay-network-modern-ssr'
// Drop every payload key except 'data' and 'errors'
// It was sending http headers and body!!
function simplifyRelayData(relayData: SSRCache) {
  return relayData.map(([key, payload]) => {
    const { data, errors } = payload;
    return [key, { data, errors }];
  });
}

function renderHtml(element: React.ReactElement) {
  const sheet = new ServerStyleSheet();
  try {
    const html = renderToString(sheet.collectStyles(element));
    const styleTags = sheet.getStyleTags();
    return { html, styleTags };
  } finally {
    sheet.seal();
  }
}

router.get('/*', async ctx => {
  // TODO - only respond to html requests
  const relaySsr = new RelayServerSSR();

  const environment = createRelayEnvironmentSsr(
    relaySsr,
    GRAPHQL_URL,
    [
      next => req => {
        const sessionCookie = ctx.cookies.get(sessionCookieName);
        if (sessionCookie) {
          req.fetchOpts.headers.cookie = `${sessionCookieName}=${sessionCookie}`;
        }
        return next(req);
      },
    ],
    version,
  );

  const result = await getFarceResult({
    url: ctx.request.url,
    historyMiddlewares,
    routeConfig,
    resolver: new Resolver(environment),
    render,
  });

  if ('redirect' in result) {
    ctx.response.redirect(result.redirect.url);
    return;
  }

  const { html, styleTags } = renderHtml(
    <RelayEnvironmentProvider environment={environment}>{result.element}</RelayEnvironmentProvider>,
  );

  try {
    const relayCache = await relaySsr.getCache();
    const relayData = simplifyRelayData(relayCache);
    ctx.status = result.status;
    ctx.body = indexHtml({ assets, styleTags, relayData, html });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('relaySsr getCache err:', err);

    if ([400, 401, 402, 403, 404].includes(err.res.status)) {
      removeCookie(ctx);
      ctx.redirect('/');
      return;
    }

    // TODO - handle 5xx

    // TODO - render beautiful error page
    ctx.response.type = 'text';
    ctx.status = 500;
    ctx.body = err.toString();
  }
});

// Initialize and configure Koa application
const server = new Koa();

// TODO - handle errors here to avoid returning Internal Server Error
server.on('error', err => {
  // eslint-disable-next-line no-console
  console.error('Error while answering request', { error: err });
});

server
  // `koa-helmet` provides security headers to help prevent common, well known attacks
  // @see https://helmetjs.github.io/
  .use(helmet())
  // Serve static files located under `process.env.RAZZLE_PUBLIC_DIR`
  // We cant use env-var here as this is defined by razzle on build-time
  .use(serve(process.env.RAZZLE_PUBLIC_DIR!))
  .use(koaLogger())
  .use(router.routes())
  .use(router.allowedMethods());

export default server;
