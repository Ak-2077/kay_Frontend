import { InfoPage } from '@/components/InfoPage';

export default function HowToWatchPage() {
  return (
    <InfoPage
      title="How To Watch"
      introTitle="How To Watch"
      introText="Follow these steps to get the best learning experience from your purchased content."
      sections={[
        {
          heading: 'Recommended Flow',
          paragraphs: [
            'Start from module one and complete lessons in sequence for best results.',
            'Apply each concept with small practical tasks before moving ahead.',
          ],
        },
        {
          heading: 'Playback Help',
          paragraphs: [
            'Use a stable internet connection and updated browser for smooth playback.',
            'If videos do not load, refresh once and clear browser cache.',
          ],
        },
      ]}
    />
  );
}
