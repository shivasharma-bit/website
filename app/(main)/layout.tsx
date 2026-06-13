import type { Metadata } from 'next';
import { Navbar }    from '../components/layout/Navbar';
import { Sidebar }   from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';

export const metadata: Metadata = {
  title: { template: '%s — Forge', default: 'Forge' },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Fixed top navigation */}
      <Navbar />

      {/* Body: sidebar + main content */}
      <div className="flex max-w-screen-xl mx-auto">
        {/* Left sidebar — desktop only */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Bottom tab bar — mobile only */}
      <MobileNav />
    </div>
  );
}
