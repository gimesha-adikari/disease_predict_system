import bcrypt from 'bcrypt';
import { UserRepo } from '../domain/repositories/UserRepo';
import { signAccess, signRefresh } from '@core/jwt';
import { SessionModel } from '../infrastructure/mongo/SessionModel';
import { env } from '@core/env';

export async function loginUser(
    repo: UserRepo,
    email: string,
    password: string,
    meta: { ip?: string; ua?: string } = {}
) {
    const user = await repo.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    if (user.status !== 'active') throw new Error('Account not active');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error('Invalid credentials');

    const sid = cryptoRandom();
    const refreshExpires = daysFromNow(env.REFRESH_TTL_DAYS);
    const refreshToken = signRefresh({ sid, sub: user.id }, refreshExpires);
    await SessionModel.create({
        sid,
        userId: user.id,
        refreshTokenHash: hash(refreshToken),
        userAgent: meta.ua || '',
        ip: meta.ip || '',
        createdAt: new Date(),
        expiresAt: refreshExpires,
    });
    const accessToken = signAccess({ sub: user.id, role: user.role, sid });
    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
}

function daysFromNow(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
}

function cryptoRandom(len: number = 22) {
    const { randomBytes } = require('crypto');
    return randomBytes(len).toString('hex').slice(0, len);
}

function hash(v: string) {
    const { createHash } = require('crypto');
    return createHash('sha256').update(v).digest('hex');
}
