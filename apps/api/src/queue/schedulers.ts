import { maintenanceQueue } from './queues.js';

export async function setupSchedulers(): Promise<void> {
  await maintenanceQueue.upsertJobScheduler(
    'ttl-cleanup-scheduler',
    { pattern: '0 2 * * *' }, // Run at 2 AM
    { name: 'enforce-ttl-policies' }
  );

  await maintenanceQueue.upsertJobScheduler(
    'daily-pipeline-scheduler',
    { pattern: '0 4 * * *' }, // Run at 4 AM
    { name: 'trigger-daily-pipeline' }
  );

  // Run TTL cleanup 1 minute after server start
  await maintenanceQueue.add('enforce-ttl-policies', {}, { delay: 60 * 1000 });
}
