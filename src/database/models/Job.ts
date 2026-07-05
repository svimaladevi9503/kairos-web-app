import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary: string;
  postedAt: string;
  logoUrl?: string;
  categories: string[];
  accommodations: {
    tooling: string[];
    policy: string[];
  };
  aiSummary: string;
  isActive: boolean;
  shareLink?: string;
}

const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    salary: { type: String, default: "Competitive" },
    postedAt: { type: String, default: "Just now" },
    logoUrl: { type: String, default: "" },
    categories: { type: [String], default: [] },
    accommodations: {
      tooling: { type: [String], default: [] },
      policy: { type: [String], default: [] },
    },
    aiSummary: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    shareLink: { type: String, default: null },
  },
  { timestamps: true }
);

export const Job = (mongoose.models.Job as mongoose.Model<IJob>) || mongoose.model<IJob>("Job", JobSchema);
