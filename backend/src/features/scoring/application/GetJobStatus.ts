import {scoreQueue} from "@features/scoring/infrastructure/queue/scoreQueue";

export async function getJobStatus(id: string) {
    const job = await scoreQueue.getJob(id);
    if (!job) return null;
    const state = await job.getState();
    return { id: job.id, state, returnvalue: job.returnvalue ?? null, failedReason: (job as any).failedReason ?? null };
}
