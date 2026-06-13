import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Inquiry from '@/lib/models/Inquiry';
import { getCurrentUser } from '@/lib/auth';

// POST /api/inquiries (public contact form)
export async function POST(req) {
  try {
    const { name, email, category, message } = await req.json();
    if (!name || !email || !category || !message) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }
    await connectDB();
    const inquiry = await Inquiry.create({ name, email, category, message });
    return NextResponse.json(inquiry, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Server error: ' + err.message }, { status: 500 });
  }
}

// GET /api/inquiries (admin)
export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  if (me.role !== 'admin') return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 403 });

  await connectDB();
  const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
  return NextResponse.json(inquiries);
}
