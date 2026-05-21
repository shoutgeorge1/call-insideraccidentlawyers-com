import type { Metadata } from 'next';
import { CarAccidentLanding } from '@/components/case-review-checker/CarAccidentLanding';

export const metadata: Metadata = {
  title:
    'Car Accident Case Review | Free, Confidential | Insider Accident Lawyers',
  description:
    'Injured in a car accident? Answer a few quick questions to check if you may qualify for a free case review. Free, confidential, no obligation.',
  openGraph: {
    title: 'Car Accident Free Case Review | Insider Accident Lawyers',
    description:
      'Answer a few quick questions to see if your car accident case may be worth reviewing.',
  },
  robots: { index: true, follow: true },
};

export default function CarAccidentCaseReviewPage() {
  return <CarAccidentLanding />;
}
