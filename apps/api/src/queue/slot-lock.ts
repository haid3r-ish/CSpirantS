import { redisConnection } from './connection.js';

const LOCK_KEY = 'pipeline:slot-running';
const LOCK_TTL_SECONDS = 1800; // 30 min

export async function acquireSlotLock(): Promise<boolean> {
  const result = await redisConnection.set(LOCK_KEY, '1', 'EX', LOCK_TTL_SECONDS, 'NX');
  return result === 'OK';
}

export async function releaseSlotLock(): Promise<void> {
  await redisConnection.del(LOCK_KEY);
}
