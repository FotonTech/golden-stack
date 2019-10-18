/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/array-type */

import DataLoader from 'dataloader';
import { Types } from 'mongoose';
import { Context } from 'koa';

import { IEvent } from './modules/event/EventModel';

export type DataLoaderKey = Types.ObjectId | string | undefined | null;

export interface GraphQLDataloaders {
  EventLoader: DataLoader<DataLoaderKey, IEvent>;
}

export interface GraphQLContext {
  dataloaders: GraphQLDataloaders;
  appplatform: string;
  koaContext: Context;
}
