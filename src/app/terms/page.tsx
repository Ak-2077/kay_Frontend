import { InfoPage } from '@/components/InfoPage';

export default function TermsPage() {
  return (
    <InfoPage
      title="Terms And Conditions"
      introTitle="Terms & Conditions"
      introText="This legal agreement is an electronic record in terms of applicable Indian laws and governs your use of our website, courses, and related services. By continuing to use this platform, you acknowledge and accept these terms."
      sections={[
        {
          heading: 'Acceptance Of Terms',
          paragraphs: [
            'By accessing this website, you agree to follow these terms and all applicable laws.',
            'If you do not agree with any part of these terms, please discontinue use of this platform.',
          ],
        },
        {
          heading: 'Course Access And Usage',
          paragraphs: [
            'Purchased courses are for personal learning use only and may not be shared, redistributed, or resold.',
            'We reserve the right to suspend access in case of policy violations, misuse, or fraudulent activity.',
          ],
        },
        {
          heading: 'Payments And Pricing',
          paragraphs: [
            'All prices are shown in INR unless otherwise stated and may change without prior notice.',
            'You are responsible for providing valid payment details and completing transactions through approved payment gateways.',
          ],
        },
      ]}
    />
  );
}
