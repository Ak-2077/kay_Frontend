'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { decrementCourseQuantity, fetchCart, type CartItem } from '@/utils/cart';
import { orderAPI } from '@/utils/api';
import { addPurchasedCoursesFromCart } from '@/utils/purchases';
import { useAuth } from '@/context/AuthContext';

type CheckoutForm = {
  name: string;
  email: string;
  billingAddress: string;
  whatsapp: string;
};

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (options: RazorpayCheckoutOptions) => RazorpayInstance;

const parsePrice = (price: string) => {
  const numeric = Number(price.replace(/[^\d.]/g, ''));
  return Number.isNaN(numeric) ? 0 : numeric;
};

const formatINR = (amount: number, decimals = 0) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

const generateIdempotencyKey = () => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export default function CheckoutPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentType, setPaymentType] = useState<'india' | 'international'>('india');
  const [orderMessage, setOrderMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    name: '',
    email: '',
    billingAddress: '',
    whatsapp: '',
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedToken = localStorage.getItem('token');
    if (!token && !storedToken) {
      router.push('/login?redirect=/checkout');
      return;
    }

    setAuthReady(true);
  }, [token, router]);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    fetchCart().then((items) => setCartItems(items));
  }, [authReady]);

  const totalAmount = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + parsePrice(item.newPrice) * item.quantity,
        0
      ),
    [cartItems]
  );
  const includedTax = useMemo(() => totalAmount - totalAmount / 1.18, [totalAmount]);
  const hasRequiredFields =
    form.billingAddress.trim().length > 0 && form.whatsapp.trim().length > 0;

  if (!authReady) {
    return (
      <main className="min-h-screen bg-[#f3f3f3] px-3 py-4 sm:px-4 md:px-6 md:py-8">
        <div className="mx-auto w-full max-w-6xl text-sm text-black/70">Loading checkout...</div>
      </main>
    );
  }

  const handleRemoveItem = async (courseId: number) => {
    const updatedCart = await decrementCourseQuantity(courseId);
    setCartItems(updatedCart);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || !hasRequiredFields) {
      return;
    }

    setOrderMessage('');
    setIsPlacingOrder(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setOrderMessage('Please login to place order from backend.');
        setIsPlacingOrder(false);
        return;
      }

      const Razorpay = (window as Window & { Razorpay?: RazorpayConstructor }).Razorpay;
      if (!Razorpay) {
        setOrderMessage('Payment SDK failed to load. Please refresh and try again.');
        setIsPlacingOrder(false);
        return;
      }

      const idempotencyKey = generateIdempotencyKey();

      const response = await orderAPI.createCheckoutOrder(
        token,
        {
        name: form.name,
        email: form.email,
        billingAddress: form.billingAddress,
        whatsapp: form.whatsapp,
        paymentType,
        },
        idempotencyKey
      );

      if (!response?.razorpayOrder?.id || !response?.keyId) {
        setOrderMessage(response?.message || 'Unable to initialize payment.');
        setIsPlacingOrder(false);
        return;
      }

      const checkout = new Razorpay({
        key: response.keyId,
        amount: response.razorpayOrder.amount,
        currency: response.razorpayOrder.currency || 'INR',
        name: 'KAY Academy',
        description: 'Course purchase',
        order_id: response.razorpayOrder.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.whatsapp,
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: () => {
            setIsPlacingOrder(false);
            setOrderMessage('Payment was cancelled.');
          },
        },
        handler: async (paymentResponse: RazorpaySuccessResponse) => {
          try {
            const verifyResponse = await orderAPI.verifyCheckoutPayment(token, paymentResponse);

            if (verifyResponse?.message?.toLowerCase().includes('success') || verifyResponse?.order?.status === 'paid') {
              addPurchasedCoursesFromCart(cartItems);
              setOrderMessage('Payment successful. Order placed.');
              const refreshedCart = await fetchCart();
              setCartItems(refreshedCart);
              return;
            }

            setOrderMessage(verifyResponse?.message || 'Payment verification failed.');
          } catch {
            setOrderMessage('Payment verification failed. Please contact support with your payment ID.');
          } finally {
            setIsPlacingOrder(false);
          }
        },
      });

      checkout.open();

    } catch {
      setOrderMessage('Unable to place order. Please try again.');
      setIsPlacingOrder(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-3 py-4 sm:px-4 md:px-6 md:py-8">
      <div className="mx-auto grid w-full max-w-6xl gap-4 md:gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg bg-[#f3f3f3] p-1 md:p-4">
          <div className="max-w-xl space-y-3">
            <input
              type="text"
              placeholder="Your Name *"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-black outline-none placeholder:text-black/80 sm:text-base"
            />

            <div className="rounded-md border border-black/10 bg-white px-3 py-2.5">
              <label className="block text-xs text-black/70">Billing Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="mt-1 w-full bg-transparent text-sm text-[#7c7e8f] outline-none sm:text-base md:text-lg"
              />
            </div>

            <div className="rounded-md border border-black/10 bg-white px-3 py-2.5">
              <label className="block text-xs text-black/70">Billing Address *</label>
              <textarea
                value={form.billingAddress}
                onChange={(event) => setForm((prev) => ({ ...prev, billingAddress: event.target.value }))}
                className="mt-1 min-h-20 w-full resize-y bg-transparent text-sm text-[#7c7e8f] outline-none sm:text-base"
                placeholder="Enter billing address"
                required
              />
            </div>

            <input
              type="tel"
              placeholder="Whatsapp No. *"
              value={form.whatsapp}
              onChange={(event) => setForm((prev) => ({ ...prev, whatsapp: event.target.value }))}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-black outline-none placeholder:text-black/80 sm:text-base"
              required
            />

            {!hasRequiredFields && (
              <p className="text-xs text-red-500">Billing Address and Whatsapp Number are required.</p>
            )}
          </div>
        </section>

        <aside className="rounded-2xl border border-black/10 bg-[#f3f3f3] p-4 md:p-5">
          <div className="space-y-3 border-b border-black/15 pb-4">
            {cartItems.length === 0 ? (
              <div className="py-2 text-sm text-[#6d6d6d]">Your cart is empty.</div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex gap-3">
                    <div
                      className="h-14 w-14 rounded bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div>
                      <h2 className="max-w-56 wrap-break-word text-xs font-medium leading-tight text-[#3a3a3a] sm:max-w-60 sm:text-sm md:text-base">
                        {item.title}
                      </h2>
                      <p className="mt-1 text-xs text-[#6d6d6d]">Qty: {item.quantity}</p>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="mt-1 text-xs font-medium text-[#d34444] hover:text-[#b83232]"
                      >
                        Remove 1
                      </button>
                    </div>
                  </div>

                  <div className="text-base font-medium text-[#2d2d2d] sm:text-lg">
                    {formatINR(parsePrice(item.newPrice) * item.quantity)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-b border-black/15 py-4 text-xs text-[#848496] sm:text-sm md:text-base">
            Do you have a coupon? <span className="font-medium text-[#2d2d2d]">Apply Coupon</span>
          </div>

          <div className="border-b border-black/15 py-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-2">
              <span className="text-base font-medium text-[#2d2d2d] sm:text-lg">TOTAL</span>
              <div className="text-left sm:text-right">
                <span className="text-lg font-medium text-[#2d2d2d] sm:text-xl">{formatINR(totalAmount)}</span>
                <span className="ml-0 block text-xs text-[#2d2d2d] sm:ml-2 sm:inline">(includes {formatINR(includedTax, 2)} Tax)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-black/20 bg-white">
            <label className="flex cursor-pointer items-center gap-2.5 border-b border-black/10 px-3 py-3 text-xs text-[#2f2f2f] sm:text-sm">
              <input
                type="radio"
                checked={paymentType === 'india'}
                onChange={() => setPaymentType('india')}
                className="h-4 w-4"
              />
              <span>All Payment INDIA ONLY</span>
            </label>
            <div className="border-b border-black/10 px-3 pb-3 text-xs font-medium text-[#2f2f2f] sm:px-9 sm:text-xs">
              UPI | Paytm | VISA | RuPay | GPay
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 px-3 py-3 text-xs text-[#2f2f2f] sm:text-sm">
              <input
                type="radio"
                checked={paymentType === 'international'}
                onChange={() => setPaymentType('international')}
                className="h-4 w-4"
              />
              <span>International Payment</span>
            </label>
            <div className="px-3 pb-3 text-base font-medium text-[#89b82d] sm:px-9 sm:text-lg">PayU</div>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-[#7a7a7a] sm:text-xs">
            By clicking on place order, you agree to our terms and conditions <span className="text-red-500">*</span>
          </p>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0 || !hasRequiredFields}
            className={`mt-4 w-full rounded-xl px-5 py-3 text-sm font-medium sm:text-base ${
              cartItems.length === 0 || !hasRequiredFields
                ? 'bg-[#d8ef24]/50 text-black/50'
                : 'bg-[#d8ef24] text-black'
            }`}
          >
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
          </button>

          {orderMessage && (
            <p className="mt-2 text-xs text-[#4b4b4b]">{orderMessage}</p>
          )}
        </aside>
      </div>
    </main>
  );
}