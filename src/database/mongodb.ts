import mongoose from "mongoose";

export const MongoService = {
  /**
   * Connects to the MongoDB Atlas cluster
   */
  async connect() {
    const uri = process.env.MONGO_URI;
    if (!uri || uri === "YOUR_MONGO_URI_HERE") {
      console.warn("[MongoDB] MONGO_URI is not set. Running in offline/mock mode.");
      return false;
    }

    if (mongoose.connection.readyState >= 1) {
      return true;
    }

    try {
      await mongoose.connect(uri);
      console.log("[MongoDB] Successfully connected to Atlas cluster.");
      return true;
    } catch (err) {
      console.error("[MongoDB] Connection failed:", err);
      return false;
    }
  },
};
