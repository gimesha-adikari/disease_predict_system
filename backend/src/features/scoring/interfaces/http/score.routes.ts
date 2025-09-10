import { Router } from 'express';
import { authMiddleware } from '@core/jwt';
import { enqueueScore } from '@features/scoring/application/EnqueueScore';
import { getJobStatus } from '@features/scoring/application/GetJobStatus';

export const scoreRouter = Router();

scoreRouter.use(authMiddleware);

scoreRouter.post('/jobs/score-now', async (req, res) => {
    const patient_id = req.body?.patient_id || 'demo';
    const id = await enqueueScore({ patient_id });
    res.status(202).json({ jobId: id });
});

scoreRouter.get('/jobs/:id', async (req, res) => {
    const info = await getJobStatus(req.params.id);
    if (!info) return res.status(404).json({ error: 'job not found' });
    res.json(info);
});
