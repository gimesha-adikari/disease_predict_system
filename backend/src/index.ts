// src/index.ts
import mongoose from 'mongoose';
import { env } from '@core/env';
import { createApp } from './server';

async function main() {
    const app = createApp();

    try {
        await mongoose.connect(env.MONGO_URI);
        console.log('[backend] Mongo connected');
    } catch (err) {
        console.error('[backend] Mongo connect error', err);
        process.exit(1);
    }

    const port = Number(env.PORT) || 4000;
    const host = env.HOST || '0.0.0.0';

    app.listen(port, host, () => {
        // show localhost in the log for convenience
        const shownHost = host === '0.0.0.0' ? 'localhost' : host;
        console.log(`[backend] listening on http://${shownHost}:${port}`);
    });
}

main();
