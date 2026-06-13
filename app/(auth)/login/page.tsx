'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { transitions } from '../../lib/transitions';
import type { Metadata } from 'next';

export default function LoginPage() {
  const router  = useRouter();
  const { login, isLoading } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/feed');
    } catch {
      setError('Invalid email or password. Please try again.');
    }
  }

  return (
    <motion.div
      {...transitions.cardEnter}
      className="w-full max-w-sm"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-semibold text-[var(--color-text-primary)] tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          Sign in to continue to Forge
        </p>
      </div>

      <div className="card p-6 space-y-4">
        {error && (
          <div className="px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-error-muted)] border border-[var(--color-error)]/20 text-sm text-[var(--color-error)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="input-base"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-primary)]">
                Password
              </label>
              <Link href="/auth/forgot" className="text-xs text-[var(--color-brand)] hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input-base"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'btn btn-primary w-full h-11 text-sm',
              isLoading && 'opacity-70 cursor-not-allowed'
            )}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[var(--color-surface)] px-3 text-xs text-[var(--color-text-tertiary)]">or</span>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary w-full h-11 text-sm gap-2"
          onClick={() => { setEmail('maya@example.com'); setPassword('password'); }}
        >
          Continue with demo account
        </button>
      </div>

      <p className="text-center text-sm text-[var(--color-text-secondary)] mt-5">
        No account?{' '}
        <Link href="/register" className="text-[var(--color-brand)] font-medium hover:underline">
          Sign up for free
        </Link>
      </p>
    </motion.div>
  );
}
