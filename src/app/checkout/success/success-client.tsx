'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode') || '—';
  const paymentId = searchParams.get('paymentId') || '—';

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-10 md:py-16">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-black/10 bg-white p-6 md:p-10">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-2xl text-white">
          ✓
        </div>

        <h1 className="text-3xl font-medium text-black md:text-4xl">Payment Successful</h1>
        <p className="mt-2 text-sm text-black/70 md:text-base">
          Your order has been placed successfully and your courses are now unlocked.
        </p>

        <div className="mt-6 space-y-3 rounded-xl border border-black/10 bg-[#f8f8f8] p-4 text-sm text-black/80">
          <p>Order ID: {orderCode}</p>
          <p>Transaction ID: {paymentId}</p>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/my-courses" className="inline-flex rounded-xl bg-black px-6 py-3 text-sm font-medium uppercase text-white transition hover:bg-black/80">
            Go to My Courses
          </Link>
          <Link href="/orders" className="inline-flex rounded-xl border border-black px-6 py-3 text-sm font-medium uppercase text-black transition hover:bg-gray-100">
            View Orders
          </Link>
          <Link href="/profile" className="inline-flex rounded-xl border border-black/20 px-6 py-3 text-sm font-medium uppercase text-black transition hover:bg-gray-100">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
