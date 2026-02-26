import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12 text-black">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col gap-8 md:flex-row md:gap-6">
          {/* Logo & Column 1 - Quick Links */}
          <div className="md:w-1/5">
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center">
                <Image
                  src="/ChatGPT Image Apr 2, 2025, 04_46_01 PM.png"
                  alt="Key Logo"
                  width={280}
                  height={90}
                  className="h-16 w-auto object-contain"
                />
              </Link>
            </div>
            
            <nav className="flex flex-col space-y-3">
              <Link href="/courses" className="text-sm font-light text-gray-800 transition hover:text-black">
                Upcoming Course
              </Link>
              <Link href="/assets" className="text-sm font-light text-gray-800 transition hover:text-black">
                Assets
              </Link>
              <Link href="/my-courses" className="text-sm font-light text-gray-800 transition hover:text-black">
                My Courses
              </Link>
              <Link href="/workshops" className="text-sm font-light text-gray-800 transition hover:text-black">
                Live Workshop
              </Link>
              <Link href="/how-to-watch" className="text-sm font-light text-gray-800 transition hover:text-black">
                How to Watch
              </Link>
              <Link href="/help" className="text-sm font-light text-gray-800 transition hover:text-black">
                Help
              </Link>
            </nav>
          </div>

          {/* Column 2 - Legal & Info */}
          <div className="md:w-1/6 md:border-l md:border-gray-300 md:pl-6 md:mt-20">
            <nav className="flex flex-col space-y-3">
              <Link href="/about" className="text-sm font-light text-gray-800 transition hover:text-black">
                About Us
              </Link>
              <Link href="/privacy" className="text-sm font-light text-gray-800 transition hover:text-black">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm font-light text-gray-800 transition hover:text-black">
                Terms and Conditions
              </Link>
              <Link href="/refund" className="text-sm font-light text-gray-800 transition hover:text-black">
                Refund & Cancellation Policy
              </Link>
              <Link href="/contact" className="text-sm font-light text-gray-800 transition hover:text-black">
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Column 3 - Social Media */}
          <div className="md:w-1/6 md:border-l md:border-gray-300 md:pl-6 md:mt-20">
            <nav className="flex flex-col space-y-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-light text-gray-800 transition hover:text-black"
              >
                Facebook
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-light text-gray-800 transition hover:text-black"
              >
                Twitter
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-light text-gray-800 transition hover:text-black"
              >
                Instagram
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-light text-gray-800 transition hover:text-black"
              >
                Youtube
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-light text-gray-800 transition hover:text-black"
              >
                Linkedin
              </a>
            </nav>
          </div>

          {/* WhatsApp Button */}
          <div className="md:flex-1 md:border-l md:border-gray-300 md:pl-6 md:mt-20">
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-black px-6 py-3 text-sm font-light text-white transition hover:bg-gray-900"
            >
              Need Help 📞 WhatsApp Me
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-200 pt-6 text-xs md:flex-row">
          <p className="font-light text-gray-800">GLOBAL NOMAD FLIMS</p>
          <p className="mt-2 font-light text-gray-800 md:mt-0">© 2026 All rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
