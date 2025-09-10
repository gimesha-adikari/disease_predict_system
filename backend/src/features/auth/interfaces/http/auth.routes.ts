import { Router } from 'express';
import { MongoUserRepo } from '../../infrastructure/mongo/MongoUserRepo';
import { LoginDto, InvitePatientDto, ActivateDto, RefreshDto } from '../dto/auth.dto';
import { loginUser } from '@features/auth/application/LoginUser';
import { registerDoctor } from '@features/auth/application/RegisterDoctor';
import { invitePatient } from '@features/auth/application/InvitePatient';
import { activateUser } from '@features/auth/application/ActivateUser';
import { authMiddleware, requireRole, signAccess, signRefresh, verifyRefresh } from '@core/jwt';
import { SessionModel } from '../../infrastructure/mongo/SessionModel';
import { env } from '@core/env';

export const authRouter = Router();
const repo = new MongoUserRepo();

// ---- Public ----
authRouter.post('/login', async (req, res) => {
    const parsed = LoginDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
    try {
        const out = await loginUser(repo, parsed.data.email, parsed.data.password, {
            ip: req.ip, ua: req.get('user-agent') || '',
        });
        res.json(out);
    } catch (e: any) {
        res.status(401).json({ error: e.message });
    }
});

authRouter.post('/refresh', async (req, res) => {
    const parsed = RefreshDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
    try {
        const claims = verifyRefresh(parsed.data.refreshToken);
        const sid = claims.sid;
        const session = await SessionModel.findOne({
            sid,
            refreshTokenHash: hash(parsed.data.refreshToken),
            revokedAt: null,
        });
        if (!session || String(session.userId) !== claims.sub) {
            return res.status(401).json({ error: 'Invalid session' });
        }
        if (session.expiresAt.getTime() < Date.now()) {
            return res.status(401).json({ error: 'Session expired' });
        }
        const user = await repo.findById(claims.sub);
        if (!user) return res.status(401).json({ error: 'User not found' });
        if (user.status !== 'active') return res.status(401).json({ error: 'Account not active' });

        const access = signAccess({ sub: user.id, role: user.role, sid });
        res.json({ accessToken: access });
    } catch (_e: any) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// ---- Doctor-only (hospital web) ----
authRouter.post('/doctors/register', authMiddleware, requireRole('doctor'), async (req, res) => {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid payload' });
    }
    try {
        const u = await registerDoctor(repo, email, password);
        res.status(201).json({ id: u.id, email: u.email, role: u.role });
    } catch (e: any) {
        res.status(409).json({ error: e.message });
    }
});

authRouter.post('/invite/patient', authMiddleware, requireRole('doctor'), async (req, res) => {
    const parsed = InvitePatientDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
    try {
        const { userId, token, expiresAt } = await invitePatient(
            repo,
            parsed.data.email,
            parsed.data.channel
        );
        // In production: send token via email/SMS. Here, return it so the doctor can copy it.
        const link = `${req.protocol}://${req.get('host')}/auth/activate?token=${token}`;
        res.status(201).json({ userId, token, link, expiresAt });
    } catch (e: any) {
        res.status(409).json({ error: e.message });
    }
});

// ---- Patient activation (mobile) ----
authRouter.post('/activate', async (req, res) => {
    const parsed = ActivateDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
    try {
        const u = await activateUser(parsed.data.token, parsed.data.password);
        // auto-login after activation
        const out = await requireLoginAfterActivation(u.id, req);
        res.json(out);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

async function requireLoginAfterActivation(userId: string, req: any) {
    const user = await repo.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.status !== 'active') throw new Error('Account not active');
    const sid = randomId();
    const refreshExpires = daysFromNow(env.REFRESH_TTL_DAYS);
    const refreshToken = signRefresh({ sid, sub: user.id }, refreshExpires);
    await SessionModel.create({
        sid,
        userId: user.id,
        refreshTokenHash: hash(refreshToken),
        userAgent: req.get('user-agent') || '',
        ip: req.ip || '',
        createdAt: new Date(),
        expiresAt: refreshExpires,
    });
    const accessToken = signAccess({ sub: user.id, role: user.role, sid });
    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
}

// ---- Me / Logout ----
authRouter.get('/me', authMiddleware, async (req, res) => {
    const u = await repo.findById((req as any).user.sub);
    if (!u) return res.status(404).json({ error: 'Not found' });
    res.json({ id: u.id, email: u.email, role: u.role, status: u.status });
});

authRouter.post('/logout', authMiddleware, async (req, res) => {
    const { sid, sub } = (req as any).user;
    await SessionModel.updateOne({ sid, userId: sub, revokedAt: null }, { $set: { revokedAt: new Date() } });
    res.json({ ok: true });
});

// Helpers
function hash(v: string) {
    const { createHash } = require('crypto');
    return createHash('sha256').update(v).digest('hex');
}
function daysFromNow(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
}
function randomId(len: number = 22) {
    const { randomBytes } = require('crypto');
    return randomBytes(len).toString('hex').slice(0, len);
}
