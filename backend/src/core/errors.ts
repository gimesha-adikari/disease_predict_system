import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function notFound(_req: Request, res: Response) {
    res.status(404).json({ error: 'Not Found' });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof ZodError) {
        return res.status(400).json({ error: 'ValidationError', details: err.issues });
    }
    const status = err?.status || 500;
    res.status(status).json({ error: err?.message || 'Internal Server Error' });
}
