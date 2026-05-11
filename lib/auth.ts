import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getDb } from './db';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const OTP_TTL_MS = 5 * 60 * 1000;

export type AuthPayload = {
  id: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

export function signAuthToken(payload: { id: number; email: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: '7d' });
}

export function verifyAuthToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET as string) as AuthPayload;
  } catch {
    return null;
  }
}

export async function getAuthTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get('auth-token')?.value || null;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string) {
  return typeof password === 'string' && password.length >= 8;
}

export async function saveOtp(email: string, otp: string) {
  const db = await getDb();
  const expiresAt = Date.now() + OTP_TTL_MS;
  const createdAt = Date.now();
  return db.run(
    'INSERT INTO auth_otps (email, otp, expires_at, used, created_at) VALUES (?, ?, ?, 0, ?)',
    [email, otp, expiresAt, createdAt]
  );
}

export async function findValidOtp(email: string, otp: string) {
  const db = await getDb();
  return db.get<{ id: number; email: string; otp: string; expires_at: number; used: number; created_at: number }>(
    'SELECT * FROM auth_otps WHERE email = ? AND otp = ? AND used = 0 AND expires_at > ? ORDER BY created_at DESC LIMIT 1',
    [email, otp, Date.now()]
  );
}

export async function markOtpUsed(id: number) {
  const db = await getDb();
  return db.run('UPDATE auth_otps SET used = 1 WHERE id = ?', [id]);
}
