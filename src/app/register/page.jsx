'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function RegisterInner() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    setError(null);
    const result = await register({ name, email, password });
    setBusy(false);
    if (result.success) {
      router.push(redirectTo);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-card glass-panel">
        <h1>Create account</h1>
        <p className="auth-sub">Join Helloween and power up your order.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Full name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="At least 6 characters" />
          </label>
          <button type="submit" className="btn btn-primary auth-submit" disabled={busy}>
            {busy ? <Loader2 size={18} className="spin" /> : <UserPlus size={18} />}
            {busy ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href={`/login${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`}>Log in</Link>
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .auth-page { min-height: calc(100vh - 80px); display: flex; align-items: center; justify-content: center; padding: 3rem 1.5rem; }
        .auth-card { width: 100%; max-width: 420px; padding: 2.5rem; }
        .auth-card h1 { font-size: 2rem; margin-bottom: 0.4rem; }
        .auth-sub { color: var(--text-secondary); margin-bottom: 1.8rem; }
        .auth-error { background: rgba(229,9,20,0.12); border: 1px solid var(--accent-red); color: #ff8a90; padding: 0.7rem 1rem; border-radius: 8px; font-size: 0.9rem; margin-bottom: 1.2rem; }
        .auth-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .auth-form label { display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.04em; }
        .auth-form input { background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.8rem 1rem; color: var(--text-primary); font-size: 1rem; }
        .auth-form input:focus { border-color: var(--accent-red); }
        .auth-submit { width: 100%; margin-top: 0.5rem; }
        .auth-switch { margin-top: 1.5rem; text-align: center; color: var(--text-secondary); font-size: 0.9rem; }
        .auth-switch a { color: var(--accent-red); font-weight: 700; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      ` }} />
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={null}>
      <RegisterInner />
    </Suspense>
  );
}
