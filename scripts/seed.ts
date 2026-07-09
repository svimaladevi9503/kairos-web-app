/**
 * scripts/seed.ts
 *
 * Seeds MongoDB with sample data for local testing:
 *   - 1 UserProfile ("user_123" equivalent — this app only supports one profile)
 *   - 20 Jobs (same shape/spirit as scraper/seed_sample_jobs.py, but via Mongoose)
 *   - 3 Applications (derived from a few of the seeded jobs)
 *   - 5 Feedback entries
 *
 * Usage:
 *   npx tsx scripts/seed.ts            # seed everything (skips if data already exists)
 *   npx tsx scripts/seed.ts --reset     # wipe these 4 collections first, then seed
 *
 * Requires MONGO_URI to be set in .env.local (same variable the app itself uses).
 */

import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";

import { UserProfile } from "../src/database/models/UserProfile";
import { Job } from "../src/database/models/Job";
import { Application } from "../src/database/models/Application";
import { Feedback } from "../src/database/models/Feedback";

if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

const RESET = process.argv.includes("--reset");

const CATEGORIES = ["Vision Impaired", "Orally Challenged", "Audibly Challenged"] as const;

const ACCOMMODATIONS: Record<(typeof CATEGORIES)[number], { tooling: string[]; policy: string[] }> = {
  "Vision Impaired": {
    tooling: [
      "NVDA/JAWS screen reader compatibility",
      "High-contrast & scalable UI themes",
      "Accessible PDF & mandatory alt-text documentation",
    ],
    policy: ["Remote-first working policy", "Flexible screen-time break schedule"],
  },
  "Orally Challenged": {
    tooling: ["AAC device support", "Text-based standup & status tools (Slack/Teams)"],
    policy: ["No mandatory verbal presentations", "Asynchronous, written-first communication culture"],
  },
  "Audibly Challenged": {
    tooling: ["Live captioning tools (Otter.ai / Google Live Transcribe)", "Visual & vibrating alert systems"],
    policy: ["Sign language interpreter budget for meetings", "Caption-mandatory video/meeting policy"],
  },
};

const TITLES = [
  "Software Engineer (Backend)", "Frontend Developer", "Data Analyst", "UX Researcher",
  "Customer Support Specialist (Chat-Based)", "QA Test Engineer", "HR Coordinator",
  "Graphic Designer", "Marketing Specialist", "Technical Writer", "Business Analyst",
  "Product Manager", "IT Support Specialist (Remote)", "Video Editor", "Translator (Written)",
  "Legal Assistant", "Research Analyst", "Bookkeeper", "Data Entry Specialist", "Accountant",
];

const COMPANIES = [
  "Nimbus Cloud Systems", "BrightPath Analytics", "Solace Health Tech", "Vertex Data Labs",
  "Lucent Software Co.", "Northwind Digital", "Clearview Media Group", "Aster & Finch Consulting",
  "Meridian Fintech", "Harborlight Studios", "Pinnacle Logistics", "Silverline Robotics",
  "Cobalt Analytics", "Evergreen Learning", "Quantum Retail Co.", "Fernwood Design",
  "BlueCrest Insurance", "Ironwood Manufacturing", "Sundial Media", "Rosewood Legal Partners",
];

const LOCATIONS = ["Remote", "Chennai, TN", "Bengaluru, KA", "Hyderabad, TS", "Pune, MH", "Remote (India)"];
const SALARIES = ["₹4,50,000 - ₹6,50,000 PA", "₹6,00,000 - ₹9,00,000 PA", "₹8,00,000 - ₹12,00,000 PA", "Competitive"];
const POSTED = ["Just now", "5 hours ago", "2 days ago", "1 week ago"];

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

function buildJob(i: number) {
  const title = pick(TITLES, i);
  const company = pick(COMPANIES, (i * 7) % COMPANIES.length);
  const location = pick(LOCATIONS, i * 3);
  const salary = pick(SALARIES, i * 5);
  const cats = i % 5 === 0 ? [CATEGORIES[0], CATEGORIES[1]] : [CATEGORIES[i % 3]];

  const tooling = [...new Set(cats.flatMap((c) => ACCOMMODATIONS[c].tooling.slice(0, 2)))];
  const policy = [...new Set(cats.flatMap((c) => ACCOMMODATIONS[c].policy.slice(0, 2)))];

  return {
    title,
    company,
    location,
    description: `${company} is hiring a ${title} to join their growing team in ${location}. This role has been reviewed and classified by Kairos's AI accommodation engine as suitable for ${cats.join(" and ")} candidates.`,
    url: `https://kairos.inclusive/jobs/sample-${i + 1}`,
    salary,
    postedAt: pick(POSTED, i),
    logoUrl: "",
    categories: cats,
    accommodations: { tooling, policy },
    aiSummary: `This role at ${company} is a strong match for ${cats.join(" and ")} job seekers — offering ${tooling[0].toLowerCase()} and following a policy of ${policy[0].toLowerCase()}.`,
    isActive: true,
  };
}

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri || uri === "YOUR_MONGO_URI_HERE") {
    console.error("[Seed] MONGO_URI is not set in .env.local — aborting.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("[Seed] Connected to MongoDB.");

  if (RESET) {
    console.log("[Seed] --reset flag set: clearing UserProfile, Job, Application, Feedback...");
    await Promise.all([
      UserProfile.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
      Feedback.deleteMany({}),
    ]);
  }

  // 1. UserProfile — the app only ever reads/writes a single profile document.
  let profile = await UserProfile.findOne();
  if (!profile) {
    profile = await UserProfile.create({
      name: "Alex Johnson",
      email: "alex.johnson@accessibility.org",
      phone: "+919876543210",
      telegramChatId: "",
      skills: ["React", "TypeScript", "Data Analysis", "Written Communication"],
      experience: "4 years as a Frontend Developer, screen-reader-first workflow.",
      education: "B.Tech, Computer Science — Anna University",
      suitabilityCategories: ["Vision Impaired"],
      accommodationRequirements: ["NVDA/JAWS screen reader compatibility", "Remote-first working policy"],
      resume: null,
      autoApply: false,
    });
    console.log(`[Seed] Created UserProfile: ${profile.email}`);
  } else {
    console.log(`[Seed] UserProfile already exists (${profile.email}), skipping.`);
  }

  // 2. Jobs
  const existingJobCount = await Job.countDocuments();
  let jobs;
  if (existingJobCount === 0) {
    jobs = await Job.insertMany(Array.from({ length: 20 }, (_, i) => buildJob(i)));
    console.log(`[Seed] Inserted ${jobs.length} sample jobs.`);
  } else {
    jobs = await Job.find().limit(20).lean();
    console.log(`[Seed] Jobs already exist (${existingJobCount}), reusing first ${jobs.length} for applications.`);
  }

  // 3. Applications — reference 3 of the seeded jobs
  const existingAppCount = await Application.countDocuments();
  if (existingAppCount === 0 && jobs.length >= 3) {
    const statuses: Array<"applied" | "interviewing" | "rejected"> = ["applied", "interviewing", "rejected"];
    const apps = await Application.insertMany(
      jobs.slice(0, 3).map((job: any, i: number) => ({
        jobId: job._id.toString(),
        job,
        appliedAt: pick(POSTED, i),
        status: statuses[i],
        decayNotificationChannel: i === 1 ? "WhatsApp" : null,
        decayMessage: i === 1 ? "Following up on your application — this posting may be stale." : null,
        shareLink: `/s/sample${i}`,
      }))
    );
    console.log(`[Seed] Inserted ${apps.length} sample applications.`);
  } else {
    console.log(`[Seed] Applications already exist (${existingAppCount}) or not enough jobs, skipping.`);
  }

  // 4. Feedback
  const existingFeedbackCount = await Feedback.countDocuments();
  if (existingFeedbackCount === 0) {
    const feedback = await Feedback.insertMany([
      { type: "job_match", targetId: jobs[0]?._id?.toString() || null, targetLabel: jobs[0]?.title || "General", rating: 5, comment: "Great match, accommodations were spot on.", timestamp: "2026-07-01 09:15" },
      { type: "job_match", targetId: jobs[1]?._id?.toString() || null, targetLabel: jobs[1]?.title || "General", rating: 3, comment: "Categories felt off for my profile.", timestamp: "2026-07-02 14:40" },
      { type: "chat_assistant", targetId: null, targetLabel: "Kairos Assistant", rating: 4, comment: "Helpful, but a bit verbose.", timestamp: "2026-07-03 11:05" },
      { type: "portal_general", targetId: null, targetLabel: "General Portal Element", rating: 5, comment: "Screen reader support is excellent.", timestamp: "2026-07-04 08:30" },
      { type: "company_review", targetId: null, targetLabel: jobs[2]?.company || "Sample Co.", rating: 4, comment: "Accessibility audit matched my interview experience.", timestamp: "2026-07-05 16:20" },
    ]);
    console.log(`[Seed] Inserted ${feedback.length} sample feedback entries.`);
  } else {
    console.log(`[Seed] Feedback already exists (${existingFeedbackCount}), skipping.`);
  }

  console.log("[Seed] Done.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[Seed] Failed:", err);
  process.exit(1);
});
