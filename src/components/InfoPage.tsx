import Link from 'next/link';
import { Footer } from '@/components/Footer';

type InfoSection = {
  heading: string;
  paragraphs: string[];
};

interface InfoPageProps {
  title: string;
  sections: InfoSection[];
  introTitle?: string;
  introText?: string;
}

export function InfoPage({
  title,
  sections,
  introTitle,
  introText,
}: InfoPageProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <section className="relative border-b border-gray-200 bg-white px-4 py-14 md:py-16">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-light uppercase md:text-5xl">{title}</h1>
          <p className="mt-4 text-sm font-light text-gray-700 md:text-base">
            <Link href="/" className="transition hover:text-black">Home</Link> / {title}
          </p>
        </div>
      </section>

      <section className="px-4 py-10 md:py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-light md:text-4xl">{introTitle ?? title}</h2>

          {introText ? (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 md:p-7">
              <h3 className="text-xl font-light md:text-2xl">User&apos;s Terms Of Use</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-gray-800 md:text-base">
                {introText}
              </p>
            </div>
          ) : null}

          <div className="mt-6 space-y-4 md:mt-8 md:space-y-5">
            {sections.map((section, index) => (
              <article key={section.heading} className="rounded-xl border border-gray-200 bg-white p-5 md:p-7">
                <h3 className="text-xl font-light md:text-2xl">
                  {index + 1}. {section.heading}
                </h3>
                <div className="mt-3 space-y-2">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm font-light leading-relaxed text-gray-800 md:text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
