import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import { getCurrentUser } from '@/lib/auth';

// GET /api/products?category=&search=&limit=
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');

    const query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    let q = Product.find(query).sort({ createdAt: -1 });
    if (limit) q = q.limit(parseInt(limit, 10));
    const products = await q;
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ message: 'Server error: ' + err.message }, { status: 500 });
  }
}

// POST /api/products (admin)
export async function POST(req) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  if (me.role !== 'admin') return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 403 });

  try {
    const body = await req.json();
    const { name, category, description, imageUrl } = body;
    if (!name || !category || !description || !imageUrl) {
      return NextResponse.json({ message: 'Please provide name, category, description and imageUrl.' }, { status: 400 });
    }
    await connectDB();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Server error: ' + err.message }, { status: 500 });
  }
}
