'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CART_UPDATED_EVENT, getCartItemCount } from '@/utils/cart';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400'],
});

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const isLandingPage = pathname === '/';
  const isCartPage = pathname === '/cart';
  const isCheckoutPage = pathname === '/checkout';
  const shouldShowNavbar = isLandingPage || isCheckoutPage || isCartPage;
  const navTextClass = isLandingPage ? 'text-white hover:text-gray-200' : 'text-black hover:text-black/70';
  const accountButtonClass = isLandingPage
    ? 'border-white text-white hover:bg-white/10'
    : 'border-black text-black hover:bg-black/5';

  useEffect(() => {
    const syncCartCount = () => {
      getCartItemCount().then((count) => setCartCount(count));
    };

    syncCartCount();
    window.addEventListener(CART_UPDATED_EVENT, syncCartCount);
    window.addEventListener('storage', syncCartCount);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCartCount);
      window.removeEventListener('storage', syncCartCount);
    };
  }, []);

  if (!shouldShowNavbar) {
    return null;
  }

  return (
    <nav
      className={`${isLandingPage ? 'absolute top-0 left-0 bg-transparent border-none shadow-none' : 'sticky top-0 bg-white/95 border-b border-black/10 shadow-sm'} w-full z-50 ${poppins.className} font-light`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center"
          >
            <Image
              src="/ChatGPT Image Apr 2, 2025, 04_46_01 PM.png"
              alt="Key Logo"
              width={340}
              height={110}
              priority
              className={`h-20 w-auto object-contain ${isLandingPage ? 'brightness-0 invert' : ''}`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center ml-auto space-x-7 text-[17px]">
            <button
              onClick={() => {
                if (isLandingPage) {
                  document.getElementById('new-courses')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`font-light transition cursor-pointer ${navTextClass}`}
            >
              COURES
            </button>
            <span className={isLandingPage ? 'text-white/70' : 'text-black/50'}>/</span>
            <Link
              href="/assets"
              className={`font-light transition ${navTextClass}`}
            >
              ASSETS
            </Link>
            <span className={isLandingPage ? 'text-white/70' : 'text-black/50'}>/</span>
            <Link
              href="/workshops"
              className={`font-light transition ${navTextClass}`}
            >
              WORKSHOPS
            </Link>
            <Link
              href="/cart"
              className={`relative font-light transition ${navTextClass}`}
            >
              <svg
                className="w-9 h-9"
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
                {cartCount}
              </span>
            </Link>
            <Link
              href={isAuthenticated ? '/profile' : '/login'}
              className={`border px-8 py-3 font-light uppercase tracking-wide transition ${accountButtonClass}`}
            >
              My Account
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`rounded-lg p-2 transition md:hidden ${isLandingPage ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/10'}`}
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

        {/* Mobile Navigation */}
        <div
          className={`${isOpen ? 'block' : 'hidden'} overflow-hidden md:hidden ${isLandingPage ? 'border-t border-white/20 bg-black/60' : 'border-t border-black/10 bg-white'}`}
        >
          <div className="space-y-3 px-4 py-4">
            <button
              onClick={() => {
                setIsOpen(false);
                if (isLandingPage) {
                  document.getElementById('new-courses')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`block w-full text-left py-2 text-[17px] font-light transition ${navTextClass}`}
            >
              Courses
            </button>
            <Link
              href="/assets"
              className={`block py-2 text-[17px] font-light transition ${navTextClass}`}
              onClick={() => setIsOpen(false)}
            >
              Assets
            </Link>
            <Link
              href="/workshops"
              className={`block py-2 text-[17px] font-light transition ${navTextClass}`}
              onClick={() => setIsOpen(false)}
            >
              Workshops
            </Link>
            <Link
              href="/cart"
              className={`block py-2 text-[17px] font-light transition ${navTextClass}`}
              onClick={() => setIsOpen(false)}
            >
              Cart
            </Link>

            <div className={`space-y-2 pt-3 ${isLandingPage ? 'border-t border-white/20' : 'border-t border-black/10'}`}>
              <Link
                href={isAuthenticated ? '/profile' : '/login'}
                className={`block rounded-lg border px-4 py-2 text-center font-light transition ${accountButtonClass}`}
                onClick={() => setIsOpen(false)}
              >
                My Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
