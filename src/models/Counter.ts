import mongoose, { Schema, Model } from 'mongoose';

export interface ICounter {
  _id: string;
  seq: number;
  updatedAt?: Date;
  createdAt?: Date;
}

const CounterSchema = new Schema<ICounter>(
  {
    _id: { type: String, required: true },
    seq: { type: Number, required: true, default: 1000 },
  },
  {
    timestamps: true,
    collection: 'counters',
  }
);

if (mongoose.models.Counter) {
  delete mongoose.models.Counter;
}

export const Counter: Model<ICounter> =
  mongoose.models.Counter || mongoose.model<ICounter>('Counter', CounterSchema, 'counters');

export default Counter;
