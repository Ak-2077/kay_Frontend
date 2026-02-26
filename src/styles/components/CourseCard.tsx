'use client';

import { type Course } from '@/data/courses';

interface CourseCardProps {
  course: Course;
  isMobile?: boolean;
  onAddToCart: (course: Course) => void;
  onEnrollNow: (course: Course) => void;
}

/**
 * Reusable Course Card Component
 * 
 * Props Example:
 * ```tsx
 * <CourseCard 
 *   course={{ id: '1', title: 'React Basics', image: '...', oldPrice: '₹999', newPrice: '₹499', status: 'Live' }}
 *   isMobile={true}
 *   onAddToCart={handleAddToCart}
 * />
 * ```
 * 
 * All styling is built-in. Just pass the course data and callback.
 */
export function CourseCard({ course, isMobile = false, onAddToCart, onEnrollNow }: CourseCardProps) {
  return (
    <article className="flex flex-col border-[0.5px] border-black bg-white">
      {/* Image Section with Status Badge */}
      <div
        className={`relative bg-cover bg-center ${
          isMobile ? 'h-80' : 'h-80 md:h-120'
        }`}
        style={{ backgroundImage: `url(${course.image})` }}
      >
        <span className="absolute right-3 top-3 bg-white px-3 py-1 text-xs font-light uppercase text-black">
          {course.status}
        </span>
      </div>

      {/* Title Section */}
      <div className={`flex-1 border-t border-black/20 ${isMobile ? 'p-3' : 'p-3 md:p-4'}`}>
        <h3 className={`font-light leading-tight uppercase ${
          isMobile ? 'text-base' : 'text-base md:text-lg md:leading-tight'
        }`}>
          {course.title}
        </h3>
      </div>

      {/* Price & Action Section */}
      <div className={`border-t border-black/20 ${
        isMobile ? 'p-3' : 'p-3 md:p-4'
      }`}>
        <div className="flex w-full items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onAddToCart(course)}
            aria-label="Add to cart"
            className="flex h-8 w-8 items-center justify-center border border-black bg-white text-black transition-colors hover:bg-gray-100 md:h-9 md:w-9"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.2 2.2c-.6.6-.2 1.8.7 1.8H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>

          <div className={`flex items-baseline gap-2 font-light ${isMobile ? 'text-xs' : 'text-xs md:text-sm'}`}>
            <span className="text-[#ff5a2c] line-through">{course.oldPrice}</span>
            <span>{course.newPrice}</span>
          </div>

          <button
            type="button"
            onClick={() => onEnrollNow(course)}
            className={`whitespace-nowrap bg-black text-white font-light uppercase transition-colors hover:bg-black/80 ${
              isMobile
                ? 'px-3 py-2 text-[10px]'
                : 'px-4 py-2 text-[10px] md:px-5 md:text-xs'
            }`}
          >
            ENROLL NOW
          </button>
        </div>
      </div>
    </article>
  );
}
