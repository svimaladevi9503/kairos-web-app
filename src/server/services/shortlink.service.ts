import crypto from "crypto";
import { ShortLink } from "../../database/models/ShortLink";
import { Job } from "../../database/models/Job";

export async function createShortLink(jobId: string, originalUrl: string) {
  const code = crypto.randomBytes(4).toString("hex"); // e.g. "a1b2c3d4"
  const link = await ShortLink.create({ code, jobId, originalUrl });
  return `/s/${link.code}`;
}

export async function resolveShortLink(code: string) {
  const link = await ShortLink.findOne({ code }).lean();
  if (!link) return null;

  const job = await Job.findById(link.jobId).lean();

  // Resilience logic: if original posting is dead, redirect into the
  // Kairos app's job detail/follow-up view instead of a 404
  if (!job || !job.isActive) {
    return { redirectTo: `/jobs/${link.jobId}?status=decayed`, decayed: true };
  }
  return { redirectTo: link.originalUrl, decayed: false };
}
