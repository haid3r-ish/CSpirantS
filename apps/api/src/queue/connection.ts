import { Redis } from 'ioredis';
import { config } from '../core/config.js';

// CRITICAL: maxRetriesPerRequest must be null for BullMQ blocking commands
export const redisConnection = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
});

export async function connectRedis(): Promise<void> {
  if (redisConnection.status === 'wait') {
    await redisConnection.connect();
    console.log('[Redis] Connected successfully');
  } else {
    console.log(`[Redis] Connection status is already: ${redisConnection.status}`);
  }
}
