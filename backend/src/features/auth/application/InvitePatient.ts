import { InviteModel } from '../infrastructure/mongo/InviteModel';
import { UserRepo } from '../domain/repositories/UserRepo';
import bcrypt from 'bcrypt';
import { env } from '@core/env';

export async function invitePatient(
    repo: UserRepo,
    email: string,
    channel: 'email'|'sms'|'qr' = 'email'
) {
    const existing = await repo.findByEmail(email);
    if (existing) {
        throw new Error('Email already registered');
    }
    const tempHash = await bcrypt.hash(randomHex(12), 10);
    const u = await repo.create({ email, passwordHash: tempHash, role: 'patient', status: 'invited' });
    const token = randomHex(32);
    const expiresAt = hoursFromNow(env.INVITE_TTL_HOURS);
    await InviteModel.create({ userId: u.id, token, expiresAt, channel });
    return { userId: u.id, token, expiresAt };
}

function randomHex(len: number) {
    const { randomBytes } = require('crypto');
    return randomBytes(len).toString('hex');
}
function hoursFromNow(h: number) {
    const d = new Date();
    d.setHours(d.getHours() + h);
    return d;
}
