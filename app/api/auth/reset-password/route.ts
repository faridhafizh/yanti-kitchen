import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { findValidOtp, markOtpUsed, isStrongPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = await request.json();
    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!isStrongPassword(newPassword)) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const otpRecord = await findValidOtp(email, otp);
    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.get('SELECT id FROM users WHERE email = ? AND is_active = 1', email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await markOtpUsed(otpRecord.id);
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.run('UPDATE users SET password = ?, updated_at = ? WHERE id = ?', [hashed, Date.now(), user.id]);

    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}