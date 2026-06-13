import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: { template: '%s — Forge', default: 'Sign in to Forge' },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <header className="h-16 flex items-center px-6 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[6px] bg-[var(--color-brand)] flex items-center justify-center">
            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Georgia, serif' }}>F</span>
          </div>
          <span className="font-semibold text-lg text-[var(--color-text-primary)] tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Forge
          </span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
      <footer className="py-6 text-center text-xs text-[var(--color-text-tertiary)]">
        {new Date().getFullYear()} Forge. All rights reserved.
      </footer>
    </div>
  );
}
