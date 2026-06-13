import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { signToken, setAuthCookie, publicUser } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, username, password } = await req.json();
    await connectDB();

    const query = email ? { email: email.toLowerCase().trim() } : { username };
    const user = await User.findOne(query);

    if (user && (await user.comparePassword(password))) {
      setAuthCookie(signToken(user._id, user.role));
      return NextResponse.json(publicUser(user));
    }
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ message: 'Server error: ' + err.message }, { status: 500 });
  }
}
