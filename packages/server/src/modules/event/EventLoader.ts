import {
  connectionFromMongoCursor,
  mongooseLoader,
  // eslint-disable-next-line
} from '@entria/graphql-mongoose-loader';
import DataLoader from 'dataloader';
import { ConnectionArguments } from 'graphql-relay';
import { Types } from 'mongoose';

import { DataLoaderKey, GraphQLContext } from '../../types';

import { escapeRegex } from '../../common/utils';

import EventModel, { IEvent } from './EventModel';

export default class Event {
  id: string;
  _id: string;
  title: string;
  description: string;
  address: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IEvent) {
    this.id = data.id || data._id;
    this._id = data._id;
    this.title = data.title;
    this.description = data.description;
    this.address = data.address;
    this.date = data.date;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

const viewerCanSee = () => true;

export const getLoader = () => new DataLoader<DataLoaderKey, IEvent>(ids => mongooseLoader(EventModel, ids as any));

export const load = async (context: GraphQLContext, id: DataLoaderKey) => {
  if (!id) {
    return null;
  }

  try {
    const data = await context.dataloaders.EventLoader.load(id);

    if (!data) {
      return null;
    }

    return viewerCanSee() ? new Event(data) : null;
  } catch (err) {
    return null;
  }
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) =>
  dataloaders.EventLoader.clear(id.toString());

export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: IEvent) =>
  dataloaders.EventLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: IEvent) =>
  clearCache(context, id) && primeCache(context, id, data);

interface LoadEventArgs extends ConnectionArguments {
  search?: string;
}

export const loadEvents = async (context: GraphQLContext, args: LoadEventArgs) => {
  const conditions: any = {};

  if (args.search) {
    const searchRegex = new RegExp(`${escapeRegex(args.search)}`, 'ig');
    conditions.$or = [{ title: { $regex: searchRegex } }, { description: { $regex: searchRegex } }];
  }

  return connectionFromMongoCursor({
    cursor: EventModel.find(conditions).sort({ date: 1 }),
    context,
    args,
    loader: load,
  });
};
