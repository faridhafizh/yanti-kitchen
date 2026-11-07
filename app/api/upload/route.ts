import { NextResponse } from 'next/server';
import { getAuthTokenFromCookies, verifyAuthToken } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const authToken = await getAuthTokenFromCookies();
    if (!authToken || !verifyAuthToken(authToken)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
    const filename = `upload-${uniqueSuffix}${safeExt}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
