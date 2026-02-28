'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClientOnly } from '@/components/ClientOnly';
import { NewCourses } from '@/components/NewCourses';
import { LatestUpcomingCourses } from '@/components/LatestUpcomingCourses';
import { InstructorSection } from '@/components/InstructorSection';
import { Footer } from '@/components/Footer';
import { type Course } from '@/data/courses';
import { addCourseToCart } from '@/utils/cart';
import gsap from 'gsap';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [featuredCourse, setFeaturedCourse] = useState<Course | null>(null);
  const router = useRouter();

  const handleHeroEnroll = async () => {
    if (!featuredCourse) {
      return;
    }

    await addCourseToCart(featuredCourse);
    router.push('/cart');
  };

  useEffect(() => {
    setMounted(true);

    if (!process.env.NEXT_PUBLIC_API_URL) {
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          setFeaturedCourse(null);
          return;
        }

        const selected = data[1] ?? data[0];
        if (!selected || !selected._id || !selected.title || !selected.thumbnail) {
          setFeaturedCourse(null);
          return;
        }

        const price = Number(selected.price ?? 0);
        const oldPrice = Number(selected.oldPrice ?? price);

        setFeaturedCourse({
          id: selected._id,
          title: selected.title,
          oldPrice: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(oldPrice),
          newPrice: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price),
          status: selected.status === 'active' ? 'Live' : 'Upcoming',
          image: selected.thumbnail,
        });
      })
      .catch(() => {
        setFeaturedCourse(null);
      });
  }, []);

  useEffect(() => {
    if (mounted && heroRef.current) {
      // Animate hero section
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, [mounted]);

  return (
    <ClientOnly>
      <>
        <div className={`${poppins.className} relative min-h-screen overflow-hidden bg-black`}>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/Showreel_trim.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/35" />

          <div
            ref={heroRef}
            className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center text-white"
          >
            <h1 className="leading-none uppercase">
              <span className="block text-[42px] font-medium md:text-[78px]">GEN-AI.</span>
              <span className="block text-[56px] font-light md:text-[132px]">MOVIES</span>
            </h1>

            <div className="mt-5 flex items-center gap-2 text-[16px] font-normal md:mt-6 md:gap-4 md:text-[28px]">
              <span className="text-[14px] font-light md:text-[22px]">level</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white text-xs font-light md:h-10 md:w-10 md:text-xl">1</span>
              <span className="text-white/75">|</span>
              <span className="text-[14px] font-light md:text-[22px]">level</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white text-xs font-light md:h-10 md:w-10 md:text-xl">2</span>
              <span className="text-white/75">|</span>
              <span className="text-[14px] font-light md:text-[22px]">level</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white text-xs font-light md:h-10 md:w-10 md:text-xl">3</span>
            </div>

            <p className="mt-4 text-[12px] font-light uppercase leading-tight md:mt-5 md:text-[25px]">
              A MULTI-AI.
              <br />
              <span className="inline-flex items-center gap-3 md:gap-6">
                <span>CREATIVE</span>
                <span>DIRECTION</span>
              </span>
              <br />
              COURSE BY KAY SUKUMAR
            </p>

            <div className="mt-5 border border-white p-1.5 md:mt-6 md:p-2">
              <button
                type="button"
                onClick={handleHeroEnroll}
                className="bg-white px-4 py-1.5 text-[11px] font-light uppercase tracking-wide text-black md:px-8 md:py-2.5 md:text-[16px]"
              >
                <span className="mr-2 line-through text-gray-500">₹9,000</span>
                <span>₹4,500 . ENROLL NOW</span>
              </button>
            </div>
          </div>
        </div>

        <NewCourses />
        <LatestUpcomingCourses />
        <InstructorSection />

        <section className="bg-black py-16 text-white md:py-24">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.25em] text-white/70">Personal Guidance</p>
            <h2 className="mt-3 text-3xl font-light uppercase md:text-5xl">1:1 Mentoring</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-light text-white/80 md:text-lg">
              Get direct feedback, project reviews, and personalized learning support tailored to your creative goals.
            </p>
            <button
              type="button"
              className="mt-8 border border-white px-8 py-3 text-sm font-light uppercase tracking-wide transition hover:bg-white hover:text-black"
            >
              Apply for Mentoring
            </button>
          </div>
        </section>

        <Footer />
      </>
    </ClientOnly>
  );
}
