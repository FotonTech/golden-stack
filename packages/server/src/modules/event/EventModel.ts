import mongoose, { Document, Model } from 'mongoose';

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      description: 'Event title',
      index: true,
      required: true,
    },
    description: {
      type: String,
      description: 'Event description',
      required: true,
    },
    address: {
      type: String,
    },
    date: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'Event',
  },
);

Schema.index({ title: 'text', description: 'text' });

export interface IEvent extends Document {
  title: string;
  description: string;
  address: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EventModel: Model<IEvent> = mongoose.model<IEvent, Model<IEvent>>('Event', Schema);

export default EventModel;
