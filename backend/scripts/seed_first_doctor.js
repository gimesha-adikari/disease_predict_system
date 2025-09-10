#!/usr/bin/env node
/**
 * Seed first doctor user into MongoDB.
 *
 * Usage:
 *   node seed_first_doctor.js --email=doctor@example.com --password="YourStrongPwd!" [--mongo="mongodb://localhost:27017/health"]
 *
 * Notes:
 * - Requires: mongoose, bcrypt, dotenv (optional).
 * - If the user already exists:
 *     - by default, it will NOT overwrite.
 *     - pass --force to reset password and set status=active.
 */

const path = require('path');
try { require('dotenv').config({ path: path.resolve(process.cwd(), '.env') }); } catch {}

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// --- Parse args ---
const args = process.argv.slice(2);
function readFlag(name, fallback = undefined) {
  const p = `--${name}=`;
  const hit = args.find(a => a.startsWith(p));
  if (hit) return hit.slice(p.length);
  if (args.includes(`--${name}`)) return true; // boolean flag
  return process.env[name.toUpperCase().replace(/-/g, '_')] ?? fallback;
}
const email = readFlag('email');
const password = readFlag('password');
const mongoUri = readFlag('mongo', process.env.MONGO_URI || 'mongodb://localhost:27017/health');
const force = !!readFlag('force', false);

if (!email || !password) {
  console.error('Missing required flags. Example:\n  node seed_first_doctor.js --email=doctor@example.com --password="YourStrongPwd!" [--mongo="mongodb://localhost:27017/health"] [--force]');
  process.exit(1);
}

// --- Minimal User model (matches backend fields) ---
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], default: 'patient', index: true },
  status: { type: String, enum: ['invited', 'active', 'locked'], default: 'invited', index: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

(async () => {
  try {
    console.log(`[seed] Connecting to ${mongoUri} ...`);
    await mongoose.connect(mongoUri);

    const existing = await User.findOne({ email });
    if (existing) {
      if (!force) {
        console.log(`[seed] User already exists: ${email}. Use --force to update password and set status=active.`);
        process.exit(0);
      }
      const hash = await bcrypt.hash(password, 12);
      existing.passwordHash = hash;
      existing.role = 'doctor';
      existing.status = 'active';
      await existing.save();
      console.log(`[seed] Updated existing doctor: ${email}`);
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      passwordHash: hash,
      role: 'doctor',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`[seed] Created first doctor: ${email}`);
    process.exit(0);
  } catch (err) {
    console.error('[seed] ERROR:', err && err.message ? err.message : err);
    process.exit(1);
  } finally {
    try { await mongoose.disconnect(); } catch {}
  }
})();
