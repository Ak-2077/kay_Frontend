'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { orderAPI } from '@/utils/api';

type OrderItem = {
  courseId: string | number;
  title: string;
  image?: string;
  price: number;
  quantity: number;
};

type OrderRecord = {
  _id: string;
  code: string;
  createdAt: string;
  amount: number;
  tax: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  paymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  items: OrderItem[];
};

const formatINR = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const token = localStorage.getItem('token');

      if (!token || !process.env.NEXT_PUBLIC_API_URL) {
        setLoading(false);
        return;
      }

      try {
        const response = await orderAPI.getMyOrders(token);
        const fetchedOrders = Array.isArray(response?.orders) ? response.orders : [];
        setOrders(fetchedOrders);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="border-b border-gray-200 px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-light uppercase md:text-5xl">Transactions & Orders</h1>
          <p className="mt-3 text-sm font-light text-gray-700 md:text-base">
            View payment transactions, order IDs, purchased items, and order status.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 md:py-12">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-700">
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-700">
              No order history found yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <article key={order._id} className="rounded-lg border border-gray-200 p-4 md:p-5">
                  <div className="flex flex-col gap-2 border-b border-gray-200 pb-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-base font-medium text-black md:text-lg">Order {order.code}</h2>
                      <p className="text-xs text-gray-600 md:text-sm">
                        Placed: {new Date(order.createdAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm font-medium text-black md:text-base">{formatINR(order.amount)}</p>
                      <p className="text-xs uppercase text-gray-600">Status: {order.status}</p>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 text-xs text-gray-700 md:grid-cols-2 md:text-sm">
                    <p>Transaction ID: {order.razorpayPaymentId || order.paymentId || '—'}</p>
                    <p>Razorpay Order ID: {order.razorpayOrderId || '—'}</p>
                  </div>

                  <div className="mt-4 space-y-2">
                    {order.items?.map((item, index) => (
                      <div key={`${order._id}-${index}`} className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm">
                        <p className="truncate pr-3 text-gray-900">{item.title}</p>
                        <p className="whitespace-nowrap text-gray-700">
                          Qty {item.quantity} • {formatINR(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/profile" className="inline-flex border border-black px-6 py-3 text-sm font-light uppercase transition hover:bg-black hover:text-white">
              Back to Profile
            </Link>
            <Link href="/my-courses" className="inline-flex border border-gray-300 px-6 py-3 text-sm font-light uppercase transition hover:bg-gray-100">
              Go to My Courses
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
