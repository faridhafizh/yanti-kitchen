import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const dataFilePath = path.join(process.cwd(), 'data/users.json');

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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    let users = [];
    let fileContents = '[]';
    try {
      fileContents = await fs.readFile(dataFilePath, 'utf8');
    } catch (error: unknown) {
      if (!error || typeof error !== 'object' || !('code' in error) || (error as { code: string }).code !== 'ENOENT') {
        throw error;
      }
      // If file doesn't exist, fileContents remains '[]'
    }

    users = JSON.parse(fileContents);

    if (users.find((u: { email: string; [key: string]: unknown }) => u.email === email)) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      email,
      password: hashedPassword,
      role
    };

    users.push(newUser);

    // Ensure data directory exists
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ success: true, user: { email: newUser.email, role: newUser.role } });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
