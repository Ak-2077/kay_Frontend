import { Suspense } from 'react';
import SuccessClient from './success-client';

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f3f3f3] px-4 py-10 md:py-16">
          <div className="mx-auto w-full max-w-3xl rounded-2xl border border-black/10 bg-white p-6 md:p-10 text-sm text-black/70">
            Loading payment details...
          </div>
        </main>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
