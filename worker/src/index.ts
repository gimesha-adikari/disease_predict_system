import 'dotenv/config';
import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq';
import { logger } from './core/log';
import { connection } from './features/scoring-consumer/infrastructure/redis';
import { processScoreJob } from './features/scoring-consumer/application/processScore';

const queueName = 'score';

const queue  = new Queue(queueName, { connection });
const events = new QueueEvents(queueName, { connection });

const worker = new Worker(
    queueName,
    async (job) => {
        logger.info({ id: job.id, name: job.name, data: job.data }, 'Processing job');
        const result = await processScoreJob(job.data as { patient_id?: string });
        logger.info({ result }, 'ML result');
        return result;
    },
    { connection }
);

// Event listeners (cast to any to avoid BullMQ typing drift across versions)
(worker as any).on('completed', (job: any, result: any) => {
    logger.info({ jobId: job?.id, result }, 'Job completed');
});
(worker as any).on('failed', (job: any, err: any) => {
    logger.error({ jobId: job?.id, err: err?.message }, 'Job failed');
});
(events as any).on('completed', (args: any) => {
    logger.info(args, 'QueueEvents: completed');
});
(events as any).on('failed', (args: any) => {
    logger.error(args, 'QueueEvents: failed');
});

// Helpful Redis connection logs
connection.on('connect', () => logger.info('Redis: connecting...'));
connection.on('ready',   () => logger.info('Redis: ready'));
connection.on('error',   (err) => logger.error({ err }, 'Redis: error'));
connection.on('end',     () => logger.warn('Redis: connection ended'));

// Demo enqueue on startup (controlled by env)
async function enqueueDemo() {
    if (process.env.DEMO_ENQUEUE !== '1') return;
    const job = await queue.add(
        'score-now',
        { patient_id: 'demo' },
        { removeOnComplete: 100, removeOnFail: 100 } as JobsOptions
    );
    logger.info({ jobId: job.id }, 'Enqueued demo job');
}
enqueueDemo().catch((e) => logger.error(e));

// Graceful shutdown
async function shutdown() {
    logger.info('Shutting down worker...');
    try {
        await Promise.allSettled([worker.close(), events.close(), queue.close()]);
        await connection.quit();
    } finally {
        process.exit(0);
    }
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
