import { buildServer } from './core/server.js';
import { config } from './core/config.js';
import { connectRedis } from './queue/connection.js';
import './pipeline/workers/discover.worker.js';
import './pipeline/workers/evaluate.worker.js';
import './pipeline/workers/extract.worker.js';
import './pipeline/workers/maintenance.worker.js';

async function start() {
  try {
    await connectRedis();
    const server = await buildServer();
    await server.listen({ port: config.PORT, host: '0.0.0.0' });
    server.log.info(`Server listening on port ${config.PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
