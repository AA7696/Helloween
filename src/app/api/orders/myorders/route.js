import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

  await connectDB();
  const orders = await Order.find({ user: me._id }).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}
