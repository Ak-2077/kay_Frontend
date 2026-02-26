'use client';

import { useRef, useState, type TouchEvent } from 'react';
import { useRouter } from 'next/navigation';
import { newCourses, type Course } from '@/data/courses';
import { addCourseToCart } from '@/utils/cart';
import { CourseCard } from '@/styles/components/CourseCard';

export function NewCourses() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const router = useRouter();

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : newCourses.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < newCourses.length - 1 ? prev + 1 : 0));
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
            {newCourses.map((course) => (
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
            {newCourses.map((_, index) => (
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
          {newCourses.map((course) => (
            <CourseCard 
              key={course.id}
              course={course} 
              isMobile={false}
              onAddToCart={handleAddToCart}
              onEnrollNow={handleEnrollNow}
            />
          ))}
        </div>
      </div>
    </section>
  );
}