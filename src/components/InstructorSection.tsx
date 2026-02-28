'use client';

import Image from 'next/image';

export function InstructorSection() {
  return (
    <section className="bg-white text-black">
      {/* Instructor Image Section */}
      <div className="relative h-96 bg-white md:h-[72vh] md:flex md:items-center md:justify-center">
        <div className="relative h-full w-full flex items-end justify-center md:items-center">
          <div className="relative h-full w-full max-w-lg">
            <Image
              src="/KAY.png"
              alt="Instructor"
              fill
              className="object-contain object-bottom md:object-center"
              priority
            />
          </div>
        </div>
      </div>

      {/* Bio + Stats Section */}
      <div className="bg-white px-4 py-12 md:px-10 md:py-10">
        <div className="mx-auto max-w-7xl md:flex md:items-start md:justify-between md:gap-12">
          <div className="md:max-w-3xl md:pt-6">
            <h2 className="mb-4 text-3xl font-light md:text-4xl">
              Hi I'm Kay
            </h2>
            <p className="max-w-3xl text-sm font-light leading-relaxed text-gray-800 md:text-base">
              Kay Sukumar is an Australian Creative Director and Brand Growth Architect with 17+ years across Australia, Europe, the US, India, and the Middle East. He blends cinematic storytelling, AI-powered production, and commercial strategy to build authority, engagement, and measurable brand growth.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 md:mt-0 md:min-w-96 md:gap-8">
            <div className="text-left">
              <p className="text-3xl font-light text-black md:text-6l">600K+</p>
              <a
                href="https://youtube.com/@kay_sukumar?si=PmIDAyduBRdte2bp"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block border-b border-gray-500 pb-1 text-base font-normal text-gray-800 transition hover:text-black"
              >
                YouTube
              </a>
            </div>
            <div className="text-left">
              <p className="text-3xl font-light text-black md:text-6l">45.6K+</p>
              <a
                href="https://www.instagram.com/kay_sukumar?igsh=YTF2cmhhMG1odGc3"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block border-b border-gray-500 pb-1 text-base font-normal text-gray-800 transition hover:text-black"
              >
                Instagram
              </a>
            </div>
            <div className="text-left">
              <p className="text-3xl font-light text-black md:text-6l">500+</p>
              <a
                href="https://www.linkedin.com/in/kay-sukumar-b6a65959/?originalSubdomain=au"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block border-b border-gray-500 pb-1 text-base font-normal text-gray-800 transition hover:text-black"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
