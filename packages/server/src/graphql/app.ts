import { koaPlayground } from 'graphql-playground-middleware';
// import { print } from 'graphql/language';
import Koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import convert from 'koa-convert';
import cors from 'koa-cors';
import graphqlHttp, { OptionsData } from 'koa-graphql';
import koaLogger from 'koa-logger';
import multer from 'koa-multer';
import Router from '@koa/router';

import * as loaders from '../loader';

import { GraphQLContext } from '../types';

import { getDataloaders } from './helper';
import { schema } from './schema';

const app = new Koa<any, Context>();
if (process.env.NODE_ENV === 'production') {
  app.proxy = true;
}

const router = new Router<any, Context>();

const storage = multer.memoryStorage();

const limits = {
  fieldSize: 30 * 1024 * 1024,
};

// if production than trick cookies library to think it is always on a secure request
if (process.env.NODE_ENV === 'production') {
  app.use((ctx, next) => {
    ctx.cookies.secure = true;
    return next();
  });
}

app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('koa error:', err);
    ctx.status = err.status || 500;
    ctx.app.emit('error', err, ctx);
  }
});

app.on('error', err => {
  // eslint-disable-next-line no-console
  console.error('Error while answering request', { error: err });
});

if (process.env.NODE_ENV !== 'test') {
  app.use(koaLogger());
}

app.use(convert(cors({ maxAge: 86400, origin: '*' })));

router.all('/graphql', multer({ storage, limits }).any());

if (process.env.NODE_ENV !== 'production') {
  router.all(
    '/playground',
    koaPlayground({
      endpoint: '/graphql',
    }),
  );
}

// Middleware to get dataloaders
app.use((ctx, next) => {
  ctx.dataloaders = getDataloaders(loaders);
  return next();
});

router.all(
  '/graphql',
  convert(
    graphqlHttp(
      async (request, ctx, koaContext: unknown): Promise<OptionsData> => {
        const { dataloaders } = koaContext;
        const { appversion, appbuild, appplatform } = request.header;

        if (process.env.NODE_ENV !== 'test') {
          // eslint-disable-next-line no-console
          console.info('Handling request', {
            appversion,
            appbuild,
            appplatform,
          });
        }

        return {
          graphiql: process.env.NODE_ENV === 'development',
          schema,
          rootValue: {
            request: ctx.req,
          },
          context: {
            dataloaders,
            appplatform,
            koaContext,
          } as GraphQLContext,
          extensions: ({ document, variables, result }) => {
            // if (process.env.NODE_ENV === 'development') {
            //   if (document) {
            //     // eslint-disable-next-line no-console
            //     console.log(print(document));
            //     // eslint-disable-next-line no-console
            //     console.log(variables);
            //     // eslint-disable-next-line no-console
            //     console.log(JSON.stringify(result, null, 2));
            //   }
            // }
            return null as any;
          },
          formatError: (error: any) => {
            if (error.path || error.name !== 'GraphQLError') {
              // eslint-disable-next-line no-console
              console.error(error);
            } else {
              // eslint-disable-next-line no-console
              console.log(`GraphQLWrongQuery: ${error.message}`);
            }

            if (error.name && error.name === 'BadRequestError') {
              ctx.status = 400;
              ctx.body = 'Bad Request';
              return {
                message: 'Bad Request',
              };
            }

            // eslint-disable-next-line no-console
            console.error('GraphQL Error', { error });

            return {
              message: error.message,
              locations: error.locations,
              stack: error.stack,
            };
          },
        };
      },
    ),
  ),
);

app.use(router.routes()).use(router.allowedMethods());

export default app;
