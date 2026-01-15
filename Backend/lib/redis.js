import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("Upstash credentials are not set in .env file.");
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

redis.get("test_connection").catch((err) => {
    console.error("Redis Connection Failed:", err);
});