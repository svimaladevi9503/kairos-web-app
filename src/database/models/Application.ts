import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  jobId: string;
  job: any; // Could be a ref, but embedding for fast reads based on user structure
  appliedAt: string;
  status: "applied" | "interviewing" | "rejected" | "link_decayed";
  decayNotificationChannel: string | null;
  decayMessage: string | null;
  shareLink?: string;
}

const ApplicationSchema: Schema = new Schema(
  {
    jobId: { type: String, required: true },
    job: { type: Schema.Types.Mixed, required: true },
    appliedAt: { type: String, default: "Just now" },
    status: { type: String, enum: ["applied", "interviewing", "rejected", "link_decayed"], default: "applied" },
    decayNotificationChannel: { type: String, default: null },
    decayMessage: { type: String, default: null },
    shareLink: { type: String, default: null },
  },
  { timestamps: true }
);

export const Application = (mongoose.models.Application as mongoose.Model<IApplication>) || mongoose.model<IApplication>("Application", ApplicationSchema);
