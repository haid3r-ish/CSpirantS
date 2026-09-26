import { redisConnection } from './connection.js';
import { config } from '../core/config.js';

// Key patterns:
// Pool list: "pipeline:article-pool"
// Threshold: "pipeline:threshold:YYYY-MM-DD"

const POOL_KEY = 'pipeline:article-pool';
const THRESHOLD_PREFIX = 'pipeline:threshold:';

export async function addToPool(articleIds: string[]): Promise<void> {
  if (articleIds.length === 0) return;
  await redisConnection.rpush(POOL_KEY, ...articleIds);
}

export async function getPoolSize(): Promise<number> {
  return await redisConnection.llen(POOL_KEY);
}

export async function drainPool(): Promise<string[]> {
  const luaScript = `
    local items = redis.call('LRANGE', KEYS[1], 0, -1)
    if #items > 0 then
      redis.call('DEL', KEYS[1])
    end
    return items
  `;
  const result = await redisConnection.eval(luaScript, 1, POOL_KEY) as string[];
  return result;
}

export async function getThreshold(dateKey: string): Promise<number> {
  const value = await redisConnection.get(`${THRESHOLD_PREFIX}${dateKey}`);
  if (value === null) {
    return config.PROCESS_THRESHOLD_START;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? config.PROCESS_THRESHOLD_START : parsed;
}

export async function setThreshold(dateKey: string, value: number): Promise<void> {
  // SET pipeline:threshold:{dateKey} value EX 172800 (48hr expiry)
  await redisConnection.set(`${THRESHOLD_PREFIX}${dateKey}`, value.toString(), 'EX', 172800);
}
