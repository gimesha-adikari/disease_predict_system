import { z } from 'zod';
export const LoginDto = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const InvitePatientDto = z.object({
    email: z.string().email(),
    channel: z.enum(['email','sms','qr']).default('email'),
});

export const ActivateDto = z.object({
    token: z.string().min(16),
    password: z.string().min(6),
});

export const RefreshDto = z.object({
    refreshToken: z.string().min(16),
});
