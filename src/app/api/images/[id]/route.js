import { connectDB } from '@/lib/db';
import ImageModel from '@/lib/models/Image';

export const runtime = 'nodejs';

// GET /api/images/:id — serve a product image stored in MongoDB.
export async function GET(_req, { params }) {
  try {
    await connectDB();
    const img = await ImageModel.findById(params.id);
    if (!img) return new Response('Not found', { status: 404 });

    return new Response(Buffer.from(img.data), {
      headers: {
        'Content-Type': img.contentType || 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
