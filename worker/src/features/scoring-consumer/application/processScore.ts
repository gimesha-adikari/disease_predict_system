import axios from 'axios';

export async function processScoreJob(data: { patient_id?: string }) {
    const base = process.env.ML_SERVICE_URL ?? 'http://localhost:8000';
    const res = await axios.post(`${base}/v1/score`, {
        patient_id: data.patient_id ?? 'demo',
    });
    return res.data;
}
