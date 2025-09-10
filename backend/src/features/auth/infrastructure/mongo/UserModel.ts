import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['patient','doctor'], default: 'patient', index: true },
    status: { type: String, enum: ['invited','active','locked'], default: 'invited', index: true },
}, { timestamps: true });

export const UserModel = mongoose.model('User', schema);
