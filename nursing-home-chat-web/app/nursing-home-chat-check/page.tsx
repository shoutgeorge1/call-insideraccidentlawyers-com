import type { Metadata } from 'next';
import { NursingHomeLanding } from '@/components/nursing-home-chat/NursingHomeLanding';

export const metadata: Metadata = {
  title: 'Nursing Home Neglect Case Check | Insider Accident Lawyers',
  description:
    'Answer a few quick questions about nursing home harm. Free, confidential case review. No fee unless we win.',
};

export default function NursingHomeChatCheckPage() {
  return <NursingHomeLanding />;
}
