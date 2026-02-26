import { InfoPage } from '@/components/InfoPage';

export default function AssetsPage() {
  return (
    <InfoPage
      title="Assets"
      introTitle="Creative Assets"
      introText="Access downloadable resources including templates, presets, and project files."
      sections={[
        {
          heading: 'Asset Usage',
          paragraphs: [
            'Assets are for personal and project use as defined in your purchase terms.',
            'Redistribution or resale of downloaded files is not allowed.',
          ],
        },
      ]}
    />
  );
}
