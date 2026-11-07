import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getDb } from '@/lib/db';
import { saveOtp, isValidEmail } from '@/lib/auth';

function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.get('SELECT id FROM users WHERE email = ? AND is_active = 1', email);
    // Always respond success to avoid user enumeration
    if (!user) {
      return NextResponse.json({ success: true, message: 'If the email exists, an OTP has been sent' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await saveOtp(email, otp);

    let transporter = createTransporter();
    let previewUrl: string | null = null;
    if (!transporter) {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email', port: 587, secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    }

    const info = await transporter.sendMail({
      from: '"Yantis Kitchen" <no-reply@yanti.com>',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your password reset OTP is ${otp}. It expires in 5 minutes.`,
      html: `<b>Your password reset OTP is ${otp}.</b> It expires in 5 minutes.`,
    });

    if (process.env.NODE_ENV !== 'production') {
      previewUrl = nodemailer.getTestMessageUrl(info) || null;
    }

    return NextResponse.json({ success: true, message: 'If the email exists, an OTP has been sent', previewUrl });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}