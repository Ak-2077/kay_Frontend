'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { orderAPI } from '@/utils/api';
import { getPurchasedCourses, type PurchasedCourse } from '@/utils/purchases';

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<PurchasedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      const localCourses = getPurchasedCourses();
      const token = localStorage.getItem('token');

      if (!token || !process.env.NEXT_PUBLIC_API_URL) {
        setCourses(localCourses);
        setLoading(false);
        return;
      }

      try {
        const response = await orderAPI.getMyCourseAccess(token);
        const backendCourses = Array.isArray(response?.courses)
          ? response.courses
              .filter(
                (course: {
                  id?: string | number;
                  title?: string;
                  image?: string;
                  purchasedAt?: string;
                  paymentStatus?: 'paid';
                  videoUrl?: string;
                  downloadUrl?: string;
                }) => typeof course.id !== 'undefined' && typeof course.title === 'string'
              )
              .map(
                (course: {
                  id: string | number;
                  title: string;
                  image?: string;
                  purchasedAt?: string;
                  paymentStatus?: 'paid';
                  videoUrl?: string;
                  downloadUrl?: string;
                }) => ({
                  id: course.id,
                  title: course.title,
                  image: course.image || '/courses.png',
                  quantity: 1,
                  purchasedAt: course.purchasedAt || new Date().toISOString(),
                  paymentStatus: 'paid' as const,
                  videoUrl: course.videoUrl || '/Showreel_trim.mp4',
                  downloadUrl: course.downloadUrl || '/Showreel_trim.mp4',
                })
              )
          : [];

        if (backendCourses.length > 0) {
          setCourses(backendCourses);
        } else {
          setCourses(localCourses);
        }
      } catch {
        setCourses(localCourses);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="border-b border-gray-200 px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-light uppercase md:text-5xl">My Courses</h1>
          <p className="mt-3 text-sm font-light text-gray-700 md:text-base">
            Access all purchased courses, watch lessons, and download available resources.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 md:py-12">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-700">
              Loading your courses...
            </div>
          ) : courses.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-700">
              No purchased courses yet. Complete checkout to unlock your course videos.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <article key={String(course.id)} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-start gap-3">
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={72}
                      height={72}
                      className="h-18 w-18 rounded object-cover"
                    />
                    <div>
                      <h2 className="text-base font-medium text-black">{course.title}</h2>
                      <p className="mt-1 text-xs text-gray-600">
                        Purchased: {new Date(course.purchasedAt).toLocaleDateString('en-IN')}
                      </p>
                      <p className="mt-1 text-xs font-medium uppercase text-green-700">{course.paymentStatus}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={course.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-black px-3 py-2 text-xs font-medium text-black transition hover:bg-black hover:text-white"
                    >
                      Watch Video
                    </a>
                    <a
                      href={course.downloadUrl}
                      download
                      className="rounded border border-gray-300 px-3 py-2 text-xs font-medium text-gray-800 transition hover:bg-gray-100"
                    >
                      Download
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-8">
            <Link href="/" className="inline-flex border border-black px-6 py-3 text-sm font-light uppercase transition hover:bg-black hover:text-white">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
