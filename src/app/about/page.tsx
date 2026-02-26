import { InfoPage } from '@/components/InfoPage';

export default function AboutPage() {
  return (
    <InfoPage
      title="About Us"
      introTitle="About Key"
      introText="We help creators build practical design, filmmaking, and AI-powered creative skills through hands-on learning designed for real-world outcomes."
      sections={[
        {
          heading: 'Our Mission',
          paragraphs: [
            'Our mission is to make high-quality creative education simple, practical, and accessible.',
            'We focus on skills that directly improve your work, portfolio, and career opportunities.',
          ],
        },
        {
          heading: 'What We Teach',
          paragraphs: [
            'Courses cover design, AI workflows, visual storytelling, content strategy, and filmmaking direction.',
            'Lessons are built around project-based learning and real creative output.',
          ],
        },
        {
          heading: 'Our Community',
          paragraphs: [
            'We support a growing community of learners from beginner to advanced levels.',
            'Our goal is long-term growth through skill depth, mentorship, and ongoing updates.',
          ],
        },
      ]}
    />
  );
}
