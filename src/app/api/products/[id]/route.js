import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import { getCurrentUser } from '@/lib/auth';

async function requireAdmin() {
  const me = await getCurrentUser();
  if (!me) return { error: NextResponse.json({ message: 'Not authorized' }, { status: 401 }) };
  if (me.role !== 'admin') return { error: NextResponse.json({ message: 'Not authorized as an admin' }, { status: 403 }) };
  return { me };
}

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ message: 'Server error: ' + err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    await connectDB();
    const body = await req.json();
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ message: 'Server error: ' + err.message }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    return NextResponse.json({ message: 'Product removed' });
  } catch (err) {
    return NextResponse.json({ message: 'Server error: ' + err.message }, { status: 500 });
  }
}
