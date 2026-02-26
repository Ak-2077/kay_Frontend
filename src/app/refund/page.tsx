import { InfoPage } from '@/components/InfoPage';

export default function RefundPage() {
  return (
    <InfoPage
      title="Refund & Cancellation Policy"
      introTitle="Refund & Cancellation"
      introText="Please review this policy carefully before purchasing. Due to the digital nature of our products, refunds and cancellations are handled under strict conditions."
      sections={[
        {
          heading: 'Digital Product Nature',
          paragraphs: [
            'Most course purchases are digital and accessible instantly, which makes returns generally non-refundable.',
            'Any exception is provided only at our sole discretion under verified technical or duplicate-payment issues.',
          ],
        },
        {
          heading: 'Cancellation Requests',
          paragraphs: [
            'Cancellation is only possible before the course is accessed or consumed.',
            'Requests must be sent with order details through our official support channels.',
          ],
        },
        {
          heading: 'Refund Processing',
          paragraphs: [
            'Approved refunds are processed to the original payment method and may take 7 to 10 business days.',
            'Bank or payment-gateway processing timelines may vary depending on your provider.',
          ],
        },
      ]}
    />
  );
}
