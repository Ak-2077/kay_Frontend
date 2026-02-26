import { InfoPage } from '@/components/InfoPage';

export default function WorkshopsPage() {
  return (
    <InfoPage
      title="Live Workshop"
      introTitle="Live Workshop"
      introText="Join interactive live sessions for deeper learning, Q&A, and direct feedback."
      sections={[
        {
          heading: 'Workshop Format',
          paragraphs: [
            'Live classes include guided sessions, practical examples, and implementation tasks.',
            'Session timing and enrollment updates are shared on official channels.',
          ],
        },
      ]}
    />
  );
}
