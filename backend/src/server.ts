import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { env } from '@core/env';
import { notFound, errorHandler } from '@core/errors';
import { authRouter } from '@features/auth/interfaces/http/auth.routes';
import { scoreRouter } from '@features/scoring/interfaces/http/score.routes';

export function createApp() {
    const app = express();
    app.use(helmet());
    app.use(cors({ origin: env.CORS_ORIGIN }));
    app.use(compression());
    app.use(express.json());

    app.get('/health', (_req, res) => res.json({ ok: true, service: 'backend' }));

    app.use('/auth', authRouter);
    app.use('/', scoreRouter);
    app.use(notFound);
    app.use(errorHandler);
    return app;
}
