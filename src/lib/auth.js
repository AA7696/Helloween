import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectDB } from './db';
import User from './models/User';

const SECRET = process.env.JWT_SECRET || 'supersecretkeyforhellenergyclone';
export const AUTH_COOKIE = 'hw_token';

export function signToken(id, role) {
  return jwt.sign({ id, role }, SECRET, { expiresIn: '30d' });
}

export function setAuthCookie(token) {
  cookies().set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export function clearAuthCookie() {
  cookies().set(AUTH_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}

// Returns the current Mongoose user doc (no password) or null.
export async function getCurrentUser() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;
  try {
    const { id } = jwt.verify(token, SECRET);
    await connectDB();
    return await User.findById(id).select('-password');
  } catch {
    return null;
  }
}

export function publicUser(u) {
  if (!u) return null;
  return { _id: u._id, name: u.name, email: u.email, username: u.username, role: u.role };
}
