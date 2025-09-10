import {ScoreJobData, scoreQueue} from "@features/scoring/infrastructure/queue/scoreQueue";

export async function enqueueScore(data: ScoreJobData) {
    const job = await scoreQueue.add('score-now', data, { removeOnComplete: 100, removeOnFail: 100 });
    return job.id;
}
