import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';

const ALLOWED = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/avif'];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// POST /api/upload — admin uploads a product image from their device.
// Saves it to public/Images/uploads and returns its public URL.
export async function POST(req) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  if (me.role !== 'admin') return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 403 });

  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }
    if (file.type && !ALLOWED.includes(file.type)) {
      return NextResponse.json({ message: 'Only image files (png, jpg, webp, gif, avif) are allowed.' }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length > MAX_BYTES) {
      return NextResponse.json({ message: 'Image must be smaller than 5 MB.' }, { status: 400 });
    }

    const ext = (path.extname(file.name || '') || '.png').toLowerCase();
    const base = (path.basename(file.name || 'image', path.extname(file.name || '')))
      .replace(/[^a-z0-9_-]/gi, '_')
      .slice(0, 40) || 'image';
    const filename = `${base}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'Images', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), bytes);

    return NextResponse.json({ url: `/Images/uploads/${filename}` }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Upload failed: ' + err.message }, { status: 500 });
  }
}
