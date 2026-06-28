import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  type: string;
  targetId: string | null;
  targetLabel: string;
  rating: number;
  comment: string;
  timestamp: string;
}

const FeedbackSchema: Schema = new Schema(
  {
    type: { type: String, required: true },
    targetId: { type: String, default: null },
    targetLabel: { type: String, default: "General Portal Element" },
    rating: { type: Number, required: true },
    comment: { type: String, default: "" },
    timestamp: { type: String, required: true },
  },
  { timestamps: true }
);

export const Feedback = (mongoose.models.Feedback as mongoose.Model<IFeedback>) || mongoose.model<IFeedback>("Feedback", FeedbackSchema);
