import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { env } from '@core/env';

export type ScoreJobData = { patient_id: string };

export const redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

export const scoreQueue = new Queue<ScoreJobData>('score', { connection: redis });
