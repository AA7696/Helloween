import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { getCurrentUser } from '@/lib/auth';

// GET /api/auth/users — list customers (admin only)
export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  if (me.role !== 'admin') return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 403 });

  await connectDB();
  const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
  return NextResponse.json(users);
}
