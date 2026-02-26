import { InfoPage } from '@/components/InfoPage';

export default function ContactPage() {
  return (
    <InfoPage
      title="Contact Us"
      introTitle="Contact & Support"
      introText="Need help with a purchase, course access, or billing? Reach out through our support channels and our team will assist you as quickly as possible."
      sections={[
        {
          heading: 'Support Channels',
          paragraphs: [
            'Email: support@key.com',
            'WhatsApp: +91 12345 67890',
          ],
        },
        {
          heading: 'Response Time',
          paragraphs: [
            'Support requests are usually answered within 24 to 48 working hours.',
            'Priority is given to billing, login, and access-related issues.',
          ],
        },
        {
          heading: 'Before You Contact',
          paragraphs: [
            'Please include your order ID, registered email, and a clear issue description for faster resolution.',
            'Screenshots or short screen recordings are helpful for technical concerns.',
          ],
        },
      ]}
    />
  );
}
