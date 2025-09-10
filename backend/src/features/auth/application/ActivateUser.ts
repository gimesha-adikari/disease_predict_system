import bcrypt from 'bcrypt';
import { InviteModel } from '../infrastructure/mongo/InviteModel';
import { MongoUserRepo } from '../infrastructure/mongo/MongoUserRepo';

export async function activateUser(inviteToken: string, password: string) {
    const invite = await InviteModel.findOne({ token: inviteToken });
    if (!invite) throw new Error('Invalid token');
    if (invite.usedAt) throw new Error('Token already used');
    if (invite.expiresAt.getTime() < Date.now()) throw new Error('Token expired');

    const repo = new MongoUserRepo();
    const user = await repo.findById(String(invite.userId));
    if (!user) throw new Error('User not found');
    const passwordHash = await bcrypt.hash(password, 10);
    await repo.updatePassword(user.id, passwordHash);
    await repo.updateStatus(user.id, 'active');
    invite.usedAt = new Date();
    await invite.save();
    return { id: user.id, email: user.email, role: user.role };
}
