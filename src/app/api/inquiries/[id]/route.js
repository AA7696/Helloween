import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Inquiry from '@/lib/models/Inquiry';
import { getCurrentUser } from '@/lib/auth';

async function requireAdmin() {
  const me = await getCurrentUser();
  if (!me) return { error: NextResponse.json({ message: 'Not authorized' }, { status: 401 }) };
  if (me.role !== 'admin') return { error: NextResponse.json({ message: 'Not authorized as an admin' }, { status: 403 }) };
  return { me };
}

export async function PUT(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    await connectDB();
    const { status } = await req.json();
    const inquiry = await Inquiry.findByIdAndUpdate(params.id, { status }, { new: true });
    if (!inquiry) return NextResponse.json({ message: 'Inquiry not found' }, { status: 404 });
    return NextResponse.json(inquiry);
  } catch (err) {
    return NextResponse.json({ message: 'Server error: ' + err.message }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    await connectDB();
    const inquiry = await Inquiry.findByIdAndDelete(params.id);
    if (!inquiry) return NextResponse.json({ message: 'Inquiry not found' }, { status: 404 });
    return NextResponse.json({ message: 'Inquiry removed' });
  } catch (err) {
    return NextResponse.json({ message: 'Server error: ' + err.message }, { status: 500 });
  }
}
