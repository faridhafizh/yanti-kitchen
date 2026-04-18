import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { otpStore } from '../login/route';
import fs from 'fs/promises';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'yantis-kitchen-super-secret-key';
const dataFilePath = path.join(process.cwd(), 'data/users.json');

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    const storedOtpData = otpStore.get(email);

    if (!storedOtpData) {
      return NextResponse.json({ error: 'No OTP found or expired' }, { status: 400 });
    }

    if (Date.now() > storedOtpData.expires) {
      otpStore.delete(email);
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }

    if (storedOtpData.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // OTP valid, remove it
    otpStore.delete(email);

    // Get user info to put in token
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const users = JSON.parse(fileContents);
    const user = users.find((u: { email: string; id: number; role: string; [key: string]: unknown }) => u.email === email);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
