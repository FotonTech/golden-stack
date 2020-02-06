import { Context } from 'koa';

import { sessionCookieName } from './config';

export const removeCookie = (ctx: Context) => {
  ctx.cookies.set(sessionCookieName, '', {
    signed: false,
    // secure: process.env.NODE_ENV === 'production',
    overwrite: true,
  });
};
