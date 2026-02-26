import { InfoPage } from '@/components/InfoPage';

export default function CoursesPage() {
  return (
    <InfoPage
      title="Upcoming Course"
      introTitle="Upcoming Course"
      introText="Explore upcoming learning tracks designed for creators, filmmakers, and AI-first storytellers."
      sections={[
        {
          heading: 'What To Expect',
          paragraphs: [
            'Structured modules from fundamentals to advanced workflows.',
            'Practical exercises focused on portfolio-grade outcomes.',
          ],
        },
      ]}
    />
  );
}
