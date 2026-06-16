'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { transitions } from '../../lib/transitions';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    displayName: '',
    username:    '',
    email:       '',
    password:    '',
  });
  const [error,     setError]     = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.username.includes(' ')) { setError('Username cannot contain spaces.'); return; }
    setIsLoading(true);
    try {
      await register(form);
      router.push('/feed');
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const fields: { name: keyof typeof form; label: string; type: string; placeholder: string }[] = [
    { name: 'displayName', label: 'Full name', type: 'text',     placeholder: 'Maya Chen'        },
    { name: 'username',    label: 'Username',  type: 'text',     placeholder: 'maya.chen'         },
    { name: 'email',       label: 'Email',     type: 'email',    placeholder: 'you@example.com'   },
    { name: 'password',    label: 'Password',  type: 'password', placeholder: 'Min. 8 characters' },
  ];

  return (
    <motion.div {...transitions.cardEnter} className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-semibold text-[var(--color-text-primary)] tracking-tight">
          Join Forge
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          Build your professional presence
        </p>
      </div>

      <div className="card p-6 space-y-4">
        {error && (
          <div className="px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-error-muted)] border border-[var(--color-error)]/20 text-sm text-[var(--color-error)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(f => (
            <div key={f.name} className="space-y-1.5">
              <label htmlFor={f.name} className="block text-sm font-medium text-[var(--color-text-primary)]">
                {f.label}
              </label>
              <input
                id={f.name}
                name={f.name}
                type={f.type}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                required
                className="input-base"
                autoComplete={f.name === 'password' ? 'new-password' : f.name}
              />
            </div>
          ))}

          <p className="text-xs text-[var(--color-text-tertiary)]">
            By joining, you agree to our{' '}
            <Link href="/terms" className="text-[var(--color-brand)] hover:underline">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[var(--color-brand)] hover:underline">Privacy Policy</Link>.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className={cn('btn btn-primary w-full h-11 text-sm', isLoading && 'opacity-70 cursor-not-allowed')}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-[var(--color-text-secondary)] mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-[var(--color-brand)] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
