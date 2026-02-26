'use client';

import { useRef, useState, type TouchEvent } from 'react';

const latestCourses = [
  {
    id: 1,
    title: 'AI FILM DIRECTOR BOOT CAMP',
    level: '1',
    episode: 'five',
    courseType: 'COURSE / GEN AI ADVERTISING',
    // duration: '14:46MIN',
    audio: 'HINDI + ENG CC',
    status: 'NEW EPISODE | OUT NOW',
    image:
      'https://images.unsplash.com/photo-1485579149c0-123123591562?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'CREATIVE DIRECTION BOOT CAMP',
    level: '1',
    episode: 'four',
    courseType: 'COURSE / GEN AI ADVERTISING',
    // duration: '14:23MIN',
    audio: 'HINDI + ENG CC',
    status: 'NEW EPISODE | OUT NOW',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'META AD STRATAGIES FOR CREATIVE',
    level: '1',
    episode: 'three',
    courseType: 'COURSE / GEN AI ADVERTISING',
    // duration: '15:16MIN',
    audio: 'HINDI + ENG CC',
    status: 'NEW EPISODE | OUT NOW',
    image:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop',
  },
];

export function LatestUpcomingCourses() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : latestCourses.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < latestCourses.length - 1 ? prev + 1 : 0));
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

  return (
    <section className="bg-white px-4 py-12 text-black md:px-8 md:py-16">
      <div className="mx-auto w-full max-w-310">
        <div className="mb-7 flex items-center justify-between md:mb-10">
          <h2 className="text-3xl font-normal uppercase md:text-6xl">LATEST + UPCOMING</h2>
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
            {latestCourses.map((course) => (
              <article key={course.id} className="w-full shrink-0 px-2">
                <div className="flex flex-col">
                  {/* Image with overlay */}
                  <div
                    className="relative h-80 bg-cover bg-center"
                    style={{ backgroundImage: `url(${course.image})` }}
                  >
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="text-white text-sm font-light">level</span>
                      <span className="text-white text-2xl font-bold">{course.level}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 max-w-xs">
                      <h3 className="text-white text-lg font-light leading-tight">
                        {course.title}
                      </h3>
                    </div>
                    <div className="absolute right-4 top-4 text-white text-sm font-light">
                      episode {course.episode}
                    </div>
                  </div>

                  {/* Info section */}
                  <div className="border border-black/20 bg-white p-4 space-y-3">
                    <div className="space-y-2 text-xs font-light uppercase">
                      <div>{course.courseType}</div>
                      {/* <div>DURATION / {course.duration}</div> */}
                      <div>AUDIO / {course.audio}</div>
                    </div>

                    <button
                      type="button"
                      className="border border-black px-6 py-2 text-xs font-light uppercase text-black transition hover:bg-black hover:text-white"
                    >
                      NOTIFY ME
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Mobile Navigation Dots */}
          <div className="mt-4 flex justify-center gap-2">
            {latestCourses.map((_, index) => (
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
        <div className="hidden grid-cols-1 gap-6 md:grid md:grid-cols-3">
          {latestCourses.map((course) => (
            <article key={course.id} className="flex flex-col">
              {/* Image with overlay */}
              <div
                className="relative h-96 bg-cover bg-center"
                style={{ backgroundImage: `url(${course.image})` }}
              >
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span className="text-white text-sm font-light">level</span>
                  <span className="text-white text-2xl font-bold">{course.level}</span>
                </div>
                <div className="absolute bottom-6 left-4 max-w-xs">
                  <h3 className="text-white text-lg md:text-xl font-light leading-tight">
                    {course.title}
                  </h3>
                </div>
                <div className="absolute right-4 top-4 text-white text-sm font-light">
                  episode {course.episode}
                </div>
              </div>

              {/* Info section */}
              <div className="border border-black/20 border-t-0 bg-white p-4 md:p-5 space-y-3">
                <div className="space-y-2 text-xs md:text-sm font-light uppercase">
                  <div>{course.courseType}</div>
                  {/* <div>DURATION / {course.duration}</div> */}
                  <div>AUDIO / {course.audio}</div>
                </div>

                <button
                  type="button"
                  className="border border-black px-6 py-2 text-xs font-light uppercase text-black transition hover:bg-black hover:text-white w-fit"
                >
                  NOTIFY ME
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
