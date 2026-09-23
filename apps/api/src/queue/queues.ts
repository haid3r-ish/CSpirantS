import { Queue } from 'bullmq';
import { redisConnection } from './connection.js';

export const discoverQueue = new Queue('pipeline-discover', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { age: 86400, count: 500 },
    removeOnFail: { age: 604800 },
  },
});

export const evaluateQueue = new Queue('pipeline-evaluate', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'exponential', delay: 10000 },
    removeOnComplete: { age: 86400, count: 100 },
    removeOnFail: { age: 604800 },
  },
});

export const extractQueue = new Queue('pipeline-extract', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 3000 },
    removeOnComplete: { age: 86400, count: 500 },
    removeOnFail: { age: 604800 },
  },
});

export const maintenanceQueue = new Queue('maintenance', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'fixed', delay: 5000 },
    removeOnComplete: { age: 86400, count: 50 },
    removeOnFail: { age: 604800 },
  },
});
