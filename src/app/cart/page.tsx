'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchCart,
  removeCourseFromCart,
  decrementCourseQuantity,
  addCourseToCart,
  clearCartCompletely,
  type CartItem,
} from '@/utils/cart';
import { useAuth } from '@/context/AuthContext';

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

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    fetchCart().then((items) => setCartItems(items));
  }, []);

  const handleRemoveItem = async (courseId: string | number) => {
    const updatedCart = await removeCourseFromCart(courseId);
    setCartItems(updatedCart);
  };

  const handleDecrementQuantity = async (courseId: string | number) => {
    const updatedCart = await decrementCourseQuantity(courseId);
    setCartItems(updatedCart);
  };

  const handleIncrementQuantity = async (courseId: string | number) => {
    const item = cartItems.find((i) => String(i.id) === String(courseId));
    if (item) {
      const updatedCart = await addCourseToCart(item);
      setCartItems(updatedCart);
    }
  };

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + parsePrice(item.newPrice) * item.quantity, 0),
    [cartItems]
  );

  const taxIncluded = useMemo(() => subtotal - subtotal / 1.18, [subtotal]);

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-3 py-4 sm:px-4 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="mb-4 text-center text-xl font-medium text-black md:mb-7 md:text-3xl">
          Your Cart
        </h1>

        <div className="grid gap-4 lg:grid-cols-[1.7fr_0.85fr] lg:gap-5">
          <section className="rounded-xl border border-black/10 bg-transparent p-3 md:p-4">
            <div className="hidden grid-cols-[1.2fr_0.4fr_0.4fr] border-b border-black/15 pb-3 text-sm font-medium text-black/80 md:grid md:text-sm">
              <div>Product</div>
              <div className="text-right">Price</div>
              <div className="text-right">Subtotal</div>
            </div>

            <div className="divide-y divide-black/10">
              {cartItems.length === 0 ? (
                <div className="py-8 text-center text-sm text-black/60">Your cart is empty.</div>
              ) : (
                cartItems.map((item) => {
                  const itemTotal = parsePrice(item.newPrice) * item.quantity;

                  return (
                    <div key={item.id} className="py-3 md:py-4">
                      <div className="flex flex-col gap-3 md:grid md:grid-cols-[1.2fr_0.4fr_0.4fr] md:items-center">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="mt-1 text-2xl leading-none text-black/60 hover:text-black"
                            aria-label="Remove item"
                          >
                            ×
                          </button>

                          <div
                            className="h-16 w-16 shrink-0 rounded bg-cover bg-center md:h-18 md:w-18"
                            style={{ backgroundImage: `url(${item.image})` }}
                          />

                          <div className="flex-1">
                            <h2 className="text-sm font-medium leading-tight text-black md:text-sm">
                              {item.title}
                            </h2>
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleDecrementQuantity(item.id)}
                                className="flex h-6 w-6 items-center justify-center rounded border border-black/20 text-xs hover:bg-black/5"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="text-xs text-black/80 w-6 text-center">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleIncrementQuantity(item.id)}
                                className="flex h-6 w-6 items-center justify-center rounded border border-black/20 text-xs hover:bg-black/5"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-left text-base font-medium text-[#8a8a9e] md:text-right md:text-lg">
                          {item.newPrice}
                        </div>

                        <div className="text-left text-sm font-medium text-black md:text-right md:text-base">
                          {formatINR(itemTotal)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-4 flex flex-col gap-3 md:mt-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="Coupon Code"
                  className="w-full rounded-full border border-black/15 bg-transparent px-5 py-2.5 text-sm text-[#8b8b9d] outline-none sm:w-56"
                />
                <button
                  type="button"
                  className="rounded-full bg-[#2d2d34] px-6 py-2.5 text-sm font-medium text-white"
                >
                  Apply coupon
                </button>
              </div>

              <button
                type="button"
                onClick={async () => {
                  const items = await fetchCart();
                  setCartItems(items);
                }}
                className="rounded-full border border-black/60 px-6 py-2.5 text-sm font-medium text-black"
              >
                Update cart
              </button>

              <button
                type="button"
                onClick={async () => {
                  const items = await clearCartCompletely();
                  setCartItems(items);
                }}
                className="rounded-full border border-red-500/70 px-6 py-2.5 text-sm font-medium text-red-700"
              >
                Clear cart completely
              </button>
            </div>
          </section>

          <aside className="h-fit rounded-xl border border-black/10 bg-transparent p-4 md:p-5">
            <h3 className="text-xl font-medium text-black md:text-2xl">Cart totals</h3>

            <div className="mt-4 space-y-3 border-b border-black/15 pb-3 md:mt-5">
              <div className="flex items-center justify-between text-sm font-medium text-black md:text-lg">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
            </div>

            <div className="mt-3 flex items-end justify-between gap-2 border-b border-black/15 pb-4 md:mt-4">
              <span className="text-base font-medium text-black md:text-xl">Total</span>
              <div className="text-right">
                <span className="text-lg font-medium text-black md:text-xl">{formatINR(subtotal)}</span>
                <span className="ml-1 block text-[11px] text-[#8a8a9e] md:ml-2 md:inline md:text-xs">
                  (includes {formatINR(taxIncluded, 2)} Tax)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  router.push('/login?redirect=/checkout');
                  return;
                }
                router.push('/checkout');
              }}
              disabled={cartItems.length === 0}
              className={`mt-5 block w-full rounded-2xl px-5 py-3 text-center text-sm font-medium md:mt-6 md:text-sm ${
                cartItems.length === 0
                  ? 'pointer-events-none bg-[#d8ef24]/50 text-black/50'
                  : 'bg-[#d8ef24] text-black'
              }`}
            >
              {isAuthenticated ? 'PROCEED TO CHECKOUT' : 'LOGIN TO PROCEED'}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}