import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { getDb } from '@/lib/db';

// Simple in-memory store for OTPs (in production use Redis or DB)
export const otpStore = new Map<string, { otp: string, expires: number }>();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', email);

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password as string);

    if (!isMatch) {
       return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP, valid for 5 minutes
    otpStore.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    });

    // Send email with nodemailer via ethereal
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"Yantis Kitchen" <no-reply@yanti.com>',
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
      html: `<b>Your OTP code is ${otp}.</b> It expires in 5 minutes.`,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return NextResponse.json({ success: true, message: 'OTP sent to email', previewUrl: nodemailer.getTestMessageUrl(info) });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
