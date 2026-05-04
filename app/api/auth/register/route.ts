import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { isValidEmail, isStrongPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const { email, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (role !== 'Admin' && role !== 'Editor') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const db = await getDb();
    const existingUser = await db.get('SELECT id FROM users WHERE email = ? AND is_active = 1', email);

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = Date.now();

    await db.run(
      'INSERT INTO users (email, password, role, created_at, updated_at, is_active) VALUES (?, ?, ?, ?, ?, 1)',
      [email, hashedPassword, role, now, now]
    );

    return NextResponse.json({ success: true, message: 'Registration completed' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
