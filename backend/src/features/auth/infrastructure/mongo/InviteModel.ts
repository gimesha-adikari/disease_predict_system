import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date, default: null },
    channel: { type: String, enum: ['email','sms','qr'], default: 'email' },
}, { timestamps: true });

export const InviteModel = mongoose.model('Invite', schema);
