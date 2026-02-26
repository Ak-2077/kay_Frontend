import { InfoPage } from '@/components/InfoPage';

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy Policy"
      introTitle="Privacy Policy"
      introText="We value your privacy and are committed to protecting your personal information. This policy explains what we collect, how we use it, and how we keep it secure."
      sections={[
        {
          heading: 'Information We Collect',
          paragraphs: [
            'We collect details such as your name, email, and order history to provide access to courses and support.',
            'Technical information such as device and browser data may be collected to improve platform performance.',
          ],
        },
        {
          heading: 'How We Use Data',
          paragraphs: [
            'Your data is used for account management, purchase processing, service communication, and platform updates.',
            'We do not sell your personal information to third parties.',
          ],
        },
        {
          heading: 'Data Security',
          paragraphs: [
            'We use reasonable security measures to protect your information from unauthorized access and misuse.',
            'You are responsible for keeping your account credentials secure.',
          ],
        },
      ]}
    />
  );
}
