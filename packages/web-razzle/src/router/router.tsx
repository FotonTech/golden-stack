import queryMiddleware from 'farce/lib/queryMiddleware';
import createRender from 'found/lib/createRender';

import App from '../App';

import Home from './home';
// import Event from './event';
import ErrorRoute from './error';

export const historyMiddlewares = [queryMiddleware];

export const routeConfig = [
  {
    name: 'root',
    path: '/',
    Component: App,
    children: [...Home, ...ErrorRoute],
  },
];

export const render = createRender({});
