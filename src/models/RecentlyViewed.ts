import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRecentlyViewedDocument extends Document {
  customerId: string;
  productId: mongoose.Types.ObjectId;
  viewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RecentlyViewedSchema = new Schema<IRecentlyViewedDocument>(
  {
    customerId: { type: String, required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    viewedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly fetch user's recent items in order of viewedAt
RecentlyViewedSchema.index({ customerId: 1, viewedAt: -1 });
// Compound index to prevent duplicates per customer and enable upsert
RecentlyViewedSchema.index({ customerId: 1, productId: 1 }, { unique: true });

export const RecentlyViewed: Model<IRecentlyViewedDocument> =
  mongoose.models.RecentlyViewed ||
  mongoose.model<IRecentlyViewedDocument>('RecentlyViewed', RecentlyViewedSchema);

export default RecentlyViewed;
