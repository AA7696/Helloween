import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { signToken, setAuthCookie, publicUser } from '@/lib/auth';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Please provide name, email and password.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    await connectDB();
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) {
      return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
    }

    const user = await User.create({ name, email: normalizedEmail, password, role: 'customer' });
    setAuthCookie(signToken(user._id, user.role));
    return NextResponse.json(publicUser(user), { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Server error: ' + err.message }, { status: 500 });
  }
}
