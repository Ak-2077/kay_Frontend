'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400'],
});

interface ProfileModalProps {
  onClose: () => void;
}

export function ProfileModal({ onClose }: ProfileModalProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    onClose();
    router.push('/');
  };

  if (!user) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 z-50 h-full w-80 bg-white shadow-2xl overflow-y-auto ${poppins.className}`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-2xl text-gray-600 transition hover:text-black z-10"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Navbar Section */}
        <div className="border-b border-gray-200 p-6">
          <Link
            href="/"
            className="flex items-center"
            onClick={onClose}
          >
            <Image
              src="/ChatGPT Image Apr 2, 2025, 04_46_01 PM.png"
              alt="Key Logo"
              width={280}
              height={90}
              priority
              className="h-12 w-auto object-contain brightness-0"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="p-6">
          <nav className="mb-6 space-y-3">
            <NavLink href="/courses" label="Courses" onClose={onClose} />
            <NavLink href="/assets" label="Assets" onClose={onClose} />
            <NavLink href="/workshops" label="Workshops" onClose={onClose} />
          </nav>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200" />

          {/* Dashboard Menu */}
          <nav className="mb-8 space-y-1">
            <NavItem icon="📊" label="Dashboard" href="#" />
            <NavItem icon="📚" label="Courses+Fonts" href="#" />
            <NavItem icon="📖" label="How to Watch" href="#" />
            <NavItem icon="⬇️" label="Downloads" href="#" />
            <NavItem icon="🧾" label="GST Invoice" href="#" />
            <NavItem icon="💳" label="Billing" href="#" />
            <NavItem icon="👤" label="Account details" href="#" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-normal text-gray-800 transition hover:bg-gray-100"
            >
              <span>🚪</span>
              <span>Log out</span>
            </button>
          </nav>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200" />

          {/* User Info Card */}
          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="mb-2 text-lg font-medium text-black">Hello {user.name}</h3>
            <p className="mb-4 text-sm text-gray-600">{user.email}</p>

            {/* Quick Links Grid */}
            <div className="space-y-4">
              <QuickLink
                icon=""
                title="My Courses + Fonts"
                description="Access and manage all your courses and fonts in one place, anytime, anywhere."
              />
              <QuickLink
                icon="👤"
                title="Account Details"
                description="Edit your personal account information, including your name, email, and profile settings."
              />
              <QuickLink
                icon="📦"
                title="My Orders and Invoices"
                description="View and manage your orders, download invoices."
              />
              <QuickLink
                icon="▶️"
                title="How to Watch"
                description="Learn the step-by-step order to watch your courses for the best learning path."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({ href, label, onClose }: { href: string; label: string; onClose: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="block text-sm font-light text-gray-800 transition hover:text-black"
    >
      {label}
    </Link>
  );
}

function NavItem({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-normal text-gray-800 transition hover:bg-gray-100"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </a>
  );
}

function QuickLink({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-lg bg-white p-4">
      <div className="mb-2 text-2xl">{icon}</div>
      <h4 className="mb-1 font-medium text-gray-800">{title}</h4>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}