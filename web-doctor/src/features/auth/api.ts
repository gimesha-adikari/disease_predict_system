import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000',
});

export function setAuth(token: string | null) {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete api.defaults.headers.common['Authorization'];
}

export async function login(email: string, password: string) {
    return api.post('/auth/login', { email, password });
}

export async function refresh(refreshToken: string) {
    return api.post('/auth/refresh', { refreshToken });
}

export async function invitePatient(email: string) {
    return api.post('/auth/invite/patient', { email, channel: 'email' });
}

export async function me() {
    return api.get('/auth/me');
}
