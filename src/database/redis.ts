import Redis from "ioredis";

// Initialize Redis only if URL is provided
const redisUrl = process.env.REDIS_URL;
let redisClient: Redis | null = null;

if (redisUrl && redisUrl !== "YOUR_REDIS_URL_HERE") {
  redisClient = new Redis(redisUrl);
  redisClient.on("connect", () => console.log("[Redis] Connected successfully."));
  redisClient.on("error", (err) => console.error("[Redis] Connection error:", err));
} else {
  console.warn("[Redis] REDIS_URL not set. Running in offline/mock mode.");
}

export const RedisService = {
  /**
   * Caches scraped job listings to prevent redundant scraping cycles
   */
  async cacheJobListing(jobId: string, jobData: any, ttlSeconds: number = 3600) {
    if (!redisClient) return false;
    try {
      await redisClient.set(`job:${jobId}`, JSON.stringify(jobData), "EX", ttlSeconds);
      return true;
    } catch (err) {
      console.error("[Redis] Cache write failed:", err);
      return false;
    }
  },

  /**
   * Retrieves a cached job listing if it exists
   */
  async getCachedJobListing(jobId: string) {
    if (!redisClient) return null;
    try {
      const data = await redisClient.get(`job:${jobId}`);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error("[Redis] Cache read failed:", err);
      return null;
    }
  },

  async deleteCachedListing(jobId: string) {
    if (!redisClient) return;
    try {
      await redisClient.del(`job:${jobId}`);
    } catch (err) {
      console.error("[Redis] Cache delete failed:", err);
    }
  },

  /**
   * Queues an application for follow-up notifications via n8n
   */
  async queueApplicationFollowUp(userId: string, jobId: string) {
    if (!redisClient) return false;
    try {
      await redisClient.lpush("app_followups", JSON.stringify({ userId, jobId, timestamp: Date.now() }));
      return true;
    } catch (err) {
      console.error("[Redis] Queue push failed:", err);
      return false;
    }
  },

  /**
   * Validates a user session or auth token at high speed
   */
  async validateSession(token: string) {
    if (!redisClient) return true; // mock mode
    const isValid = await redisClient.get(`session:${token}`);
    return !!isValid;
  },

  /**
   * Tracks n8n notification status (e.g., WhatsApp, Telegram)
   */
  async updateNotificationStatus(notificationId: string, status: "pending" | "sent" | "failed") {
    if (!redisClient) return true;
    await redisClient.hset("n8n_notifications", notificationId, status);
    return true;
  }
};
