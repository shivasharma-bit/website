import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forge — Where professional work lives',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <header className="h-16 flex items-center justify-between px-6 md:px-12 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[6px] bg-[var(--color-brand)] flex items-center justify-center">
            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Georgia, serif' }}>F</span>
          </div>
          <span className="font-semibold text-lg tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: 'Georgia, serif' }}>Forge</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"    className="btn btn-ghost text-sm">Sign in</Link>
          <Link href="/register" className="btn btn-primary text-sm">Get started</Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-8">
        <div className="max-w-2xl space-y-5">
          <h1 className="text-5xl md:text-6xl font-display font-semibold text-[var(--color-text-primary)] tracking-tight leading-tight text-balance">
            Where professional work lives
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed">
            Share case studies, build your portfolio, and connect with the people shaping your industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/register" className="btn btn-primary h-12 px-8 text-base">
              Join Forge
            </Link>
            <Link href="/login" className="btn btn-secondary h-12 px-8 text-base">
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
