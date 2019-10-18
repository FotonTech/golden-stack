import { Event } from '../../src/models';
import { IEvent } from '../../src/modules/event/EventModel';

export const createEvent = async (payload: Partial<IEvent> = {}) => {
  const n = (global.__COUNTERS__.event += 1);
  const { title, description } = payload;

  return new Event({
    ...payload,
    title: title || `Event #${n}`,
    description: description || `This is an awesome event #${n}`,
  }).save();
};
