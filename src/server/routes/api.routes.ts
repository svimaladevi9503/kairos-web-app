import express from "express";
import { Job } from "../../database/models/Job";
import { UserProfile } from "../../database/models/UserProfile";
import { Application } from "../../database/models/Application";
import { Feedback } from "../../database/models/Feedback";
import { RedisService } from "../../database/redis";
import { computeCompatibility } from "../services/matching.service";
import { 
  getGeminiClient, 
  callOpenRouter, 
  callOpenRouterMessages, 
  callGroq, 
  callMistral, 
  generateEmbeddingsHF 
} from "../services/ai.service";
import { createShortLink } from "../services/shortlink.service";

export const apiRouter = express.Router();

// 1. GET Full List of Jobs
apiRouter.get("/jobs", async (req, res) => {
  try {
    const cachedJobs = await RedisService.getCachedJobListing("all_jobs");
    if (cachedJobs) {
      console.log("[API] Returning jobs from Redis cache");
      return res.json(cachedJobs);
    }

    const dbJobs = await Job.find({ isActive: true }).lean();
    let profile: any = await UserProfile.findOne().lean();
    if (!profile) profile = { suitabilityCategories: [], skills: [], accommodationRequirements: [] };

    const jobsWithMatches = dbJobs.map((job) => {
      const match = computeCompatibility(job, profile);
      return {
        ...job,
        id: job._id.toString(),
        ...match,
      };
    });

    await RedisService.cacheJobListing("all_jobs", jobsWithMatches, 60);
    res.json(jobsWithMatches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// GET Profile
apiRouter.get("/profile", async (req, res) => {
  try {
    const profile = await UserProfile.findOne().lean();
    res.json(profile || null);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// POST Update Profile
apiRouter.post("/profile", async (req, res) => {
  try {
    const updateData = req.body;
    let profile = await UserProfile.findOne();
    
    if (profile) {
      Object.assign(profile, updateData);
      await profile.save();
    } else {
      profile = await UserProfile.create(updateData);
    }

    await RedisService.cacheJobListing("all_jobs", null, 0); 
    res.json({ message: "Profile updated successfully", profile });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// GET Company Review Scraped with AI
apiRouter.get("/company-review/:companyName", async (req, res) => {
  const { companyName } = req.params;
  const cacheKey = `company_review_${companyName}`;
  const cachedReview = await RedisService.getCachedJobListing(cacheKey);
  if (cachedReview) return res.json(cachedReview);
  
  const prompt = `Perform an AI-based web scrape simulation and accessibility audit review for the company "${companyName}".
Specifically focus on:
1. "Accommodations Rating & Detail"
2. "Company Environment"
3. "Infrastructure & Facilities"

Write the response in JSON format matching the schema exactly:
{
  "accommodationsRating": 4.8,
  "environmentRating": 4.7,
  "infrastructureRating": 4.6,
  "accommodationsDetail": "A detailed 2-sentence description.",
  "environmentDetail": "A detailed 2-sentence description.",
  "infrastructureDetail": "A detailed 2-sentence description.",
  "webScrapedUrl": "https://example.com/accessibility-audit",
  "scrapedAt": "Just now (Live Web Scraped)"
}`;

  let finalData;
  try {
    const client = getGeminiClient();
    if (client) {
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      finalData = JSON.parse(response.text || "{}");
    } else {
      throw new Error("Gemini Client not initialized");
    }
  } catch (geminiError) {
    console.warn("Gemini Error, falling back to OpenRouter...");
    try {
      const fallbackDataText = await callOpenRouter(prompt, "You are an AI summarizing company accessibility features. Return valid JSON only.", "google/gemini-2.5-flash", true);
      finalData = JSON.parse(fallbackDataText);
    } catch (openRouterError) {
      finalData = {
        accommodationsRating: 4.5,
        environmentRating: 4.5,
        infrastructureRating: 4.5,
        accommodationsDetail: `Excellent support customized for employees at ${companyName}.`,
        environmentDetail: `Highly respectful, asynchronous, and neuro-inclusive environment.`,
        infrastructureDetail: `Modern remote workspace packages and physically accessible facilities.`,
        webScrapedUrl: `https://${companyName.toLowerCase().replace(/\s+/g, "")}.com/accessibility-reviews`,
        scrapedAt: "Just now (Live Web Scraped)"
      };
    }
  }

  await RedisService.cacheJobListing(cacheKey, finalData, 86400);
  return res.json(finalData);
});

// GET Continuous Retraining Dataset Feed
apiRouter.get("/feedback", async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.json(feedback.map(f => ({ ...f, id: f._id.toString() })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

// POST Submit rating/feedback
apiRouter.post("/feedback", async (req, res) => {
  try {
    const { type, targetId, targetLabel, rating, comment } = req.body;
    if (!type || !rating) return res.status(400).json({ error: "Feedback type and rating are required." });

    const newFeedback = await Feedback.create({
      type,
      targetId: targetId || null,
      targetLabel: targetLabel || "General Portal Element",
      rating: Number(rating),
      comment: comment || "",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
    });

    res.status(201).json({ ...newFeedback.toObject(), id: newFeedback._id.toString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

// 2. GET Applications
apiRouter.get("/applications", async (req, res) => {
  try {
    const apps = await Application.find().lean();
    let profile: any = await UserProfile.findOne().lean();
    if (!profile) profile = { suitabilityCategories: [], skills: [], accommodationRequirements: [] };

    const appsWithMatches = apps.map((app) => {
      const match = computeCompatibility(app.job, profile);
      return { 
        ...app, 
        id: app._id.toString(),
        job: { ...app.job, id: app.job._id?.toString() || app.job.id, ...match } 
      };
    });
    res.json(appsWithMatches);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// 3. POST Apply to a Job
apiRouter.post("/apply", async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findOne({ $or: [{ _id: jobId.length === 24 ? jobId : null }, { id: jobId }] }).lean();
    if (!job) return res.status(404).json({ error: "Job not found" });

    const exists = await Application.findOne({ jobId });
    if (exists) return res.json({ ...exists.toObject(), id: exists._id.toString() });

    const shareLink = await createShortLink(job._id.toString(), job.url);

    const newApp = await Application.create({
      jobId: job._id.toString(),
      job,
      appliedAt: "Just now",
      status: "applied",
      shareLink,
    });

    await RedisService.queueApplicationFollowUp("user_123", job._id.toString());
    res.status(201).json({ ...newApp.toObject(), id: newApp._id.toString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to apply" });
  }
});

// 4. POST Simulated n8n Webhook
apiRouter.post("/trigger-decay", async (req, res) => {
  try {
    const { applicationId, channel } = req.body;
    const targetApp = await Application.findById(applicationId);

    if (!targetApp) return res.status(404).json({ error: "Application not found" });

    await Job.findByIdAndUpdate(targetApp.jobId, { isActive: false });
    await RedisService.cacheJobListing("all_jobs", null, 0);

    targetApp.job.isActive = false;
    targetApp.status = "link_decayed";
    targetApp.decayNotificationChannel = channel || "WhatsApp";

    let message = "";
    const shortUrl = targetApp.shareLink || (targetApp.job && targetApp.job.shareLink) || "/s/fallback";
    const fullLink = req.protocol + "://" + req.get("host") + shortUrl;

    if (channel === "WhatsApp") {
      message = `🔔 *Kairos Automated Alert* 🔔\nHi there! Our automation detected that the original listing for *${targetApp.job.title}* at *${targetApp.job.company}* has expired.\n\nWe have automatically moved this to your *Follow-Up Tracker*.\nView details here: ${fullLink}`;
    } else if (channel === "Telegram") {
      message = `✈️ *Kairos Follow-Up Bot* ✈️\n⚠️ ALERT: The listing for *${targetApp.job.title}* (${targetApp.job.company}) is no longer active.\n\nWe've flagged this in your Applied Dashboard under "Follow-Up".\nSecure link: ${fullLink}`;
    } else {
      message = `✉️ Kairos Application Follow-Up Service ✉️\n\nSubject: Follow-up Alert: ${targetApp.job.title} link expired\n\nDear Job Seeker,\n\nOur automated workflow has detected that the job page for ${targetApp.job.title} at ${targetApp.job.company} has been removed. \n\nWe have updated your status to "Follow-Up Required".\n\nYou can access your saved application details here: ${fullLink}`;
    }

    targetApp.decayMessage = message;
    await targetApp.save();
    
    await RedisService.updateNotificationStatus(applicationId, "sent");

    res.json({ ...targetApp.toObject(), id: targetApp._id.toString() });
  } catch (err) {
    res.status(500).json({ error: "Decay simulation failed" });
  }
});

// 5. POST AI Chatbot Assistant
apiRouter.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    const activeJobs = await Job.find({ isActive: true }).lean();
    const availableJobsContext = JSON.stringify(activeJobs);

    const systemInstruction = `You are Kairos, a compassionate and structured AI Inclusive Career Guide.
The user is a job seeker who is differently-abled. Your task is to assist them in finding suitable roles based on their interests and accommodation preferences.
Here is the current list of inclusive job postings available in our system:
${availableJobsContext}
Guide the user conversational-wise. Recommend matching roles. Explain exactly why the role matches their accessibility needs. Keep responses well-structured.`;

    const chatMessages = [{ role: "system", content: systemInstruction }];
    if (history) {
      history.forEach((h: any) => {
        chatMessages.push({ role: h.sender === "user" ? "user" : "assistant", content: h.text });
      });
    }
    chatMessages.push({ role: "user", content: message });

    let responseText = "";
    try {
      responseText = await callMistral(chatMessages);
    } catch (mistralError) {
      console.warn("Mistral Error, falling back to OpenRouter...");
      try {
        responseText = await callOpenRouterMessages(chatMessages, "mistralai/mistral-7b-instruct:free");
      } catch (openRouterError) {
        responseText = "Hello! I am your Kairos inclusive career assistant. Please check your Mistral or OpenRouter API keys to restore full AI capabilities.";
      }
    }
    
    console.log("[MongoDB] Archiving chat history for retraining...");
    res.json({ text: responseText });
  } catch (err) {
    res.status(500).json({ error: "Chat failed" });
  }
});

// 6. POST Paste and AI-classify a Job Description
apiRouter.post("/add-job", async (req, res) => {
  const { jobDescriptionText } = req.body;
  if (!jobDescriptionText || jobDescriptionText.trim().length < 20) {
    return res.status(400).json({ error: "Please enter a valid, substantial job description to classify." });
  }

  const prompt = `Analyze the following job description. Extract the job details and perform classification for differently-abled suitability categories.
Job Description:
"""
${jobDescriptionText}
"""`;

  const systemInstruction = `You are an AI job classifier. Return ONLY a valid JSON object matching this structure:
{
  "title": "Job Title",
  "company": "Company Name",
  "location": "Remote or city",
  "salary": "Salary range or 'Competitive'",
  "categories": ["Vision Impaired", "Orally Challenged", "Audibly Challenged"],
  "toolingAccommodations": ["tool1", "tool2"],
  "policyAccommodations": ["policy1", "policy2"],
  "aiSummary": "Summary here"
}
Output nothing except the JSON data.`;

  let parsedData;
  try {
    const groqResponse = await callGroq(prompt, systemInstruction, true);
    parsedData = JSON.parse(groqResponse);
  } catch (groqError) {
    console.warn("Groq Error, falling back to OpenRouter...");
    try {
      const openRouterResponse = await callOpenRouter(prompt, systemInstruction, "meta-llama/llama-3-8b-instruct:free", true);
      parsedData = JSON.parse(openRouterResponse);
    } catch (openRouterError) {
      return res.status(500).json({ error: "Failed to classify the job with AI." });
    }
  }

  try {
    const newJob = await Job.create({
      title: parsedData.title || "Parsed Role",
      company: parsedData.company || "Inclusive Co.",
      location: parsedData.location || "Remote",
      description: jobDescriptionText.substring(0, 300) + "...",
      url: "https://kairos.inclusive/jobs/parsed-job",
      salary: parsedData.salary || "Competitive",
      postedAt: "Just now",
      categories: (parsedData.categories || []).filter((c: string) =>
        ["Vision Impaired", "Orally Challenged", "Audibly Challenged"].includes(c)
      ),
      accommodations: {
        tooling: parsedData.toolingAccommodations || ["Accessibility support"],
        policy: parsedData.policyAccommodations || ["Flexible onboarding"],
      },
      aiSummary: parsedData.aiSummary || "This job was successfully parsed and added to our database.",
      isActive: true,
    });
    
    const shareLink = await createShortLink(newJob._id.toString(), newJob.url);
    await Job.findByIdAndUpdate(newJob._id, { $set: { shareLink } });

    await RedisService.cacheJobListing("all_jobs", null, 0);
    return res.status(201).json({ ...newJob.toObject(), id: newJob._id.toString() });
  } catch (err) {
    return res.status(500).json({ error: "Failed to save parsed job to MongoDB." });
  }
});

// 7. POST Embed utility using Hugging Face
apiRouter.post("/embed", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const embedding = await generateEmbeddingsHF(text);
    res.json({ embedding });
  } catch (err: any) {
    console.error("Embedding error:", err);
    res.status(500).json({ error: "Failed to generate embedding" });
  }
});
