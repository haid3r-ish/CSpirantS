import { maintenanceQueue } from './queues.js';

export async function setupSchedulers(): Promise<void> {
  await maintenanceQueue.upsertJobScheduler(
    'ttl-cleanup-scheduler',
    { pattern: '0 2 * * *' }, // Run at 2 AM
    { name: 'enforce-ttl-policies' }
  );

  await maintenanceQueue.upsertJobScheduler(
    'slot-10', { pattern: '0 10 * * *' }, { name: 'run-pipeline-slot', data: { hour: 10 } }
  );
  await maintenanceQueue.upsertJobScheduler(
    'slot-14', { pattern: '0 14 * * *' }, { name: 'run-pipeline-slot', data: { hour: 14 } }
  );
  await maintenanceQueue.upsertJobScheduler(
    'slot-18', { pattern: '0 18 * * *' }, { name: 'run-pipeline-slot', data: { hour: 18 } }
  );
  await maintenanceQueue.upsertJobScheduler(
    'slot-00', { pattern: '0 0 * * *' }, { name: 'run-pipeline-slot', data: { hour: 0 } }
  );

  // Run TTL cleanup 1 minute after server start
  await maintenanceQueue.add('enforce-ttl-policies', {}, { delay: 60 * 1000 });
}
