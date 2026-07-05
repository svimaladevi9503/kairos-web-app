import mongoose, { Schema, Document } from "mongoose";

export interface IShortLink extends Document {
  code: string;
  jobId: string;
  originalUrl: string;
  isActive: boolean;
}

const ShortLinkSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    jobId: { type: String, required: true },
    originalUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ShortLink =
  (mongoose.models.ShortLink as mongoose.Model<IShortLink>) ||
  mongoose.model<IShortLink>("ShortLink", ShortLinkSchema);
