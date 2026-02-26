import { InfoPage } from '@/components/InfoPage';

export default function HelpPage() {
  return (
    <InfoPage
      title="Help"
      introTitle="Help Center"
      introText="Find quick answers for account, payment, and course playback issues."
      sections={[
        {
          heading: 'Account Issues',
          paragraphs: [
            'If you cannot log in, reset your password from the login page.',
            'Use the same email address used during checkout.',
          ],
        },
        {
          heading: 'Course Access',
          paragraphs: [
            'Purchased courses appear in your account after successful payment confirmation.',
            'If access is delayed, contact support with your order ID.',
          ],
        },
      ]}
    />
  );
}
