import mongoose from 'mongoose';

import Event from '../modules/event/EventModel';

mongoose.Promise = global.Promise;

export { Event };
