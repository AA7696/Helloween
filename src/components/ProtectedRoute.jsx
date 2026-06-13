'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Wrap a page's content to require an authenticated user (optionally an admin).
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (requireAdmin && user.role !== 'admin') {
      router.replace('/');
    }
  }, [user, loading, requireAdmin, router, pathname]);

  if (loading || !user || (requireAdmin && user.role !== 'admin')) {
    return null;
  }
  return children;
}
