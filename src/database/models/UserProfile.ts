import mongoose, { Schema, Document } from "mongoose";

export interface IUserProfile extends Document {
  name: string;
  email: string;
  skills: string[];
  experience: string;
  education: string;
  suitabilityCategories: string[];
  accommodationRequirements: string[];
  resume: any; // URL to Firebase Storage
  autoApply: boolean;
}

const UserProfileSchema: Schema = new Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    skills: { type: [String], default: [] },
    experience: { type: String, default: "" },
    education: { type: String, default: "" },
    suitabilityCategories: { type: [String], default: [] },
    accommodationRequirements: { type: [String], default: [] },
    resume: { type: Schema.Types.Mixed, default: null },
    autoApply: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserProfile = (mongoose.models.UserProfile as mongoose.Model<IUserProfile>) || mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);
