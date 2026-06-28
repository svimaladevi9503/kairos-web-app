/**
 * Kairos Database Architecture
 * 
 * Exports the three independent data layers, adhering to the Single Responsibility Principle:
 * 1. MongoDB: Intelligence & Content
 * 2. Firebase: File Management
 * 3. Redis: Operational Speed & Cache
 */

export { MongoService } from "./mongodb";
export { FirebaseService } from "./firebase";
export { RedisService } from "./redis";
