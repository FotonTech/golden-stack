import { Context } from 'koa';

const NotFound = async (ctx: Context) => {
  ctx.status = 404;
  ctx.response.type = 'text';
  ctx.body = `${ctx.url} Not Found: GraphQL was supposed to be accessed on another server 🤔`;
};

export default NotFound;
