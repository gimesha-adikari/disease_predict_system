import bcrypt from 'bcrypt';
import { UserRepo } from '../domain/repositories/UserRepo';
import { Role } from '@features/auth/domain/entities/User';

export async function registerUser(repo: UserRepo, email: string, password: string, role: Role) {
    const existing = await repo.findByEmail(email);
    if (existing) throw new Error('Email already registered');
    const passwordHash = await bcrypt.hash(password, 10);
    return repo.create({ email, passwordHash, role, status: 'active' });
}
