import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ImageModel from '@/lib/models/Image';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';

const ALLOWED = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/avif'];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// POST /api/upload — admin uploads a product image from their device.
// Stores it in MongoDB and returns its served URL (/api/images/<id>).
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
    const contentType = file.type || 'image/png';
    if (!ALLOWED.includes(contentType)) {
      return NextResponse.json({ message: 'Only image files (png, jpg, webp, gif, avif) are allowed.' }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length > MAX_BYTES) {
      return NextResponse.json({ message: 'Image must be smaller than 5 MB.' }, { status: 400 });
    }

    await connectDB();
    const img = await ImageModel.create({ data: bytes, contentType });

    return NextResponse.json({ url: `/api/images/${img._id}` }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Upload failed: ' + err.message }, { status: 500 });
  }
}
