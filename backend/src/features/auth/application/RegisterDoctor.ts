import bcrypt from 'bcrypt';
import { UserRepo } from '../domain/repositories/UserRepo';

export async function registerDoctor(repo: UserRepo, email: string, password: string) {
    const existing = await repo.findByEmail(email);
    if (existing) throw new Error('Email already registered');
    const passwordHash = await bcrypt.hash(password, 10);
    // Doctors are active immediately
    return repo.create({ email, passwordHash, role: 'doctor', status: 'active' });
}
