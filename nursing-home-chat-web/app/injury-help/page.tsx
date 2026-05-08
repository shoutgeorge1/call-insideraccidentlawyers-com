import type { Metadata } from 'next';
import InjuryHelpPage from '@/components/injury-help/injury-help';

export const metadata: Metadata = {
  title: 'Injury Help | Free Review | Something Feel Wrong After Treatment? | Insider Accident Lawyers',
  description:
    'Something feel off after care or medication? Free, confidential help. You do not need to name your case type—call for a straight conversation. No fee unless we win.',
  openGraph: {
    title: 'Injury Help | Insider Accident Lawyers',
    description: 'Free review if something does not feel right after treatment, medication, or care.',
  },
  robots: { index: true, follow: true },
};

export default function InjuryHelp() {
  return <InjuryHelpPage />;
}
