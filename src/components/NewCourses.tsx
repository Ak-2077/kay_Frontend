'use client';

import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { useRouter } from 'next/navigation';
import { type Course } from '@/data/courses';
import { addCourseToCart } from '@/utils/cart';
import { CourseCard } from '@/styles/components/CourseCard';

type BackendCourse = {
  _id: string;
  title: string;
  price: number;
  oldPrice?: number;
  thumbnail: string;
  status?: 'active' | 'inactive' | 'draft';
};

const formatINR = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export function NewCourses() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      setCourses([]);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`)
      .then((res) => res.json())
      .then((data) => {
        const nextCourses = Array.isArray(data)
          ? data
              .filter((course: BackendCourse) => course && course._id && course.title && course.thumbnail)
              .filter((course: BackendCourse) => (course.status || 'active') === 'active')
              .map((course: BackendCourse) => ({
                id: course._id,
                title: course.title,
                oldPrice: formatINR(Number(course.oldPrice ?? course.price ?? 0)),
                newPrice: formatINR(Number(course.price ?? 0)),
                status: 'Live',
                image: course.thumbnail,
              }))
          : [];

        setCourses(nextCourses);
        setCurrentIndex(0);
      })
      .catch(() => {
        setCourses([]);
      });
  }, []);

  const totalSlides = courses.length;

  const handlePrev = () => {
    if (totalSlides <= 1) {
      return;
    }
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNext = () => {
    if (totalSlides <= 1) {
      return;
    }
    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = event.changedTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      return;
    }

    if (totalSlides <= 1) {
      return;
    }

    const deltaX = touchStartX.current - touchEndX.current;
    const swipeThreshold = 40;

    if (Math.abs(deltaX) < swipeThreshold) {
      return;
    }

    if (deltaX > 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  const handleAddToCart = async (course: Course) => {
    await addCourseToCart(course);
    router.push('/cart');
  };

  const handleEnrollNow = async (course: Course) => {
    await addCourseToCart(course);
    router.push('/checkout');
  };

  return (
    <section id="new-courses" className="bg-white px-4 py-12 text-black md:px-8 md:py-16">
      <div className="mx-auto w-full max-w-310">
        <div className="mb-7 flex items-center justify-between md:mb-10">
          <h2 className="text-3xl font-normal uppercase md:text-6xl">COURSES</h2>
          <div className="hidden items-center gap-4 md:flex">
            <button
              onClick={handlePrev}
              className="cursor-pointer text-8xl font-thin text-black/30 transition hover:text-black/50"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="cursor-pointer text-8xl font-thin text-black/30 transition hover:text-black/50"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-lg border border-black/10 bg-[#f8f8f8] px-4 py-4 text-sm text-black/70">
            No courses available right now. Add courses from admin portal.
          </div>
        ) : (
          <>

        {/* Mobile Carousel - Single Card */}
        <div
          className="relative overflow-hidden md:hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {courses.map((course) => (
              <div key={course.id} className="w-full shrink-0 px-2">
                <CourseCard 
                  course={course} 
                  isMobile={true}
                  onAddToCart={handleAddToCart}
                  onEnrollNow={handleEnrollNow}
                />
              </div>
            ))}
          </div>
          
          {/* Mobile Navigation Dots */}
          <div className="mt-4 flex justify-center gap-2">
            {courses.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-black w-6' : 'bg-black/30'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid - All Cards Visible */}
        <div className="hidden grid-cols-1 gap-5 md:grid md:grid-cols-3">
          {courses.map((course) => (
            <CourseCard 
              key={course.id}
              course={course} 
              isMobile={false}
              onAddToCart={handleAddToCart}
              onEnrollNow={handleEnrollNow}
            />
          ))}
        </div>
          </>
        )}
      </div>
    </section>
  );
}