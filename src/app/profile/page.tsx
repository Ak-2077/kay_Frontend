'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Footer } from '@/components/Footer';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400'],
});

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className={`min-h-screen bg-white ${poppins.className}`}>
      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white font-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/ChatGPT Image Apr 2, 2025, 04_46_01 PM.png"
                alt="Key Logo"
                width={320}
                height={100}
                priority
                className="h-12 w-auto object-contain brightness-0"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center ml-auto space-x-7 text-[17px]">
              <Link
                href="/courses"
                className="font-light text-gray-800 transition hover:text-black"
              >
                COURSES
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href="/assets"
                className="font-light text-gray-800 transition hover:text-black"
              >
                ASSETS
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href="/workshops"
                className="font-light text-gray-800 transition hover:text-black"
              >
                WORKSHOPS
              </Link>
              <Link
                href="/cart"
                className="relative font-light text-gray-800 transition hover:text-black"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-light">
                  0
                </span>
              </Link>
              <Link
                href="/"
                className="border border-gray-800 px-8 py-3 font-light uppercase tracking-wide text-gray-800 transition hover:bg-gray-100"
              >
                Home
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-gray-800 transition hover:bg-gray-100 md:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isOpen && (
            <div className="border-t border-gray-200 bg-white md:hidden">
              <div className="space-y-1 px-4 py-2">
                <Link
                  href="/courses"
                  className="block rounded-lg px-4 py-2 text-gray-800 transition hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  COURSES
                </Link>
                <Link
                  href="/assets"
                  className="block rounded-lg px-4 py-2 text-gray-800 transition hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  ASSETS
                </Link>
                <Link
                  href="/workshops"
                  className="block rounded-lg px-4 py-2 text-gray-800 transition hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  WORKSHOPS
                </Link>
                {/* <Link
                  href="/cart"
                  className="block rounded-lg px-4 py-2 text-gray-800 transition hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  CART
                </Link> */}
                <Link
                  href="/"
                  className="block rounded-lg px-4 py-2 text-gray-800 transition hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  HOME
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-4">
              <NavItem icon="/Dashboard.png" label="Dashboard" href="/profile" active={pathname === '/profile'} />
              <NavItem icon="/courses.png" label="Courses" href="/my-courses" active={pathname === '/my-courses'} />
              <NavItem icon="/download.png" label="Downloads" href="/my-courses" active={pathname === '/my-courses'} />
              <NavItem icon="/certification.png" label="Account details" href="/account-details" active={pathname === '/account-details'} />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-normal text-gray-800 transition hover:bg-gray-100"
              >
                <Image
                  src="/logout.png"
                  alt="Logout"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>Log out</span>
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {/* User Info Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-black mb-2">
                Hello {user?.name}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>

            {/* Success Message */}
            <div className="mb-8 flex items-center gap-3 rounded-lg bg-black px-6 py-4 text-white">
              <span>✓</span>
              <span>You have successfully logged in.</span>
            </div>

            {/* Quick Links Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <QuickLink
                icon="/courses.png"
                title="My Courses "
                description="Access and manage all your courses and fonts in one place, anytime, anywhere."
                href="/my-courses"
              />
              <QuickLink
                icon="/certification.png"
                title="Account Details"
                description="Edit your personal account information, including your name, email, and profile settings."
                href="/account-details"
              />
              <QuickLink
                icon="/booking.png"
                title="My Orders and Invoices"
                description="View and manage your orders, download invoices."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function NavItem({
  icon,
  label,
  href,
  active = false,
}: {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}) {
  const isImagePath = icon.endsWith('.png') || icon.endsWith('.svg');
  
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-base font-normal transition ${
        active
          ? 'bg-gray-100 text-black'
          : 'text-gray-800 hover:bg-gray-100'
      }`}
    >
      {isImagePath ? (
        <Image
          src={icon}
          alt={label}
          width={20}
          height={20}
          className="w-5 h-5"
        />
      ) : (
        <span>{icon}</span>
      )}
      <span>{label}</span>
    </Link>
  );
}

function QuickLink({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href?: string;
}) {
  const isImagePath = icon.endsWith('.png') || icon.endsWith('.svg');

  const content = (
    <div className="rounded-lg border border-gray-200 p-6 transition hover:shadow-lg">
      {isImagePath ? (
        <div className="mb-4">
          <Image
            src={icon}
            alt={title}
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </div>
      ) : (
        <div className="mb-4 text-3xl">{icon}</div>
      )}
      <h3 className="mb-2 text-lg font-medium text-black">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
