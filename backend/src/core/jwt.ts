import { sign as jwtSign, verify as jwtVerify, type Secret, type SignOptions } from 'jsonwebtoken';
import { env } from './env';

export type Role = 'patient' | 'doctor';

export type AccessClaims = { sub: string; role: Role; sid: string };
export type RefreshClaims = { sid: string; sub: string };

const ACCESS_SECRET = env.JWT_ACCESS_SECRET as unknown as Secret;
const REFRESH_SECRET = env.JWT_REFRESH_SECRET as unknown as Secret;
const EXPIRES_IN = env.ACCESS_TTL as unknown as SignOptions['expiresIn'];

export const signAccess = (claims: AccessClaims): string =>
    jwtSign(claims, ACCESS_SECRET, { expiresIn: EXPIRES_IN });

export const verifyAccess = (token: string): AccessClaims =>
    jwtVerify(token, ACCESS_SECRET) as AccessClaims;

export const signRefresh = (claims: RefreshClaims, expiresAt: Date): string =>
    jwtSign({ ...claims, exp: Math.floor(expiresAt.getTime() / 1000) }, REFRESH_SECRET);

export const verifyRefresh = (token: string): (RefreshClaims & { exp: number }) =>
    jwtVerify(token, REFRESH_SECRET) as any;

export const authMiddleware = (req: any, res: any, next: any) => {
    const hdr = req.headers.authorization;
    if (!hdr) return res.status(401).json({ error: 'Missing Authorization' });
    try {
        const token = hdr.replace(/^Bearer\s+/i, '');
        (req as any).user = verifyAccess(token);
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const requireRole = (...roles: Role[]) => (req: any, res: any, next: any) => {
    const u = (req as any).user as AccessClaims | undefined;
    if (!u) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(u.role)) return res.status(403).json({ error: 'Forbidden' });
    return next();
};
