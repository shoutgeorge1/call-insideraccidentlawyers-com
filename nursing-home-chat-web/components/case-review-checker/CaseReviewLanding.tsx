'use client';

import { useCallback } from 'react';
import { trackTelClick } from '@/lib/dataLayer';
import { PRIMARY_PHONE_DISPLAY, PRIMARY_TEL_HREF } from '@/lib/site';
import { StickyCallBar } from '@/components/nursing-home-chat/StickyCallBar';
import { CaseReviewChecker } from './CaseReviewChecker';
import type { CaseReviewConfig } from './types';

type CaseReviewLandingProps = {
  config: CaseReviewConfig;
};

/**
 * Top-level landing layout for case review pages.
 *
 * - Sticky header with call link
 * - Quiz (CaseReviewChecker) mounted as the hero module
 * - Trust strip + sticky call bar reused from the nursing-home-chat funnel
 * - Footer with attorney advertising disclaimer
 */
export function CaseReviewLanding({ config }: CaseReviewLandingProps) {
  const onCallClick = useCallback(() => trackTelClick(), []);

  return (
    <main className="min-h-dvh bg-gradient-to-b from-slate-100 via-white to-white pb-36 sm:pb-32">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a
            href="https://call.insideraccidentlawyers.com/"
            className="font-display text-lg font-extrabold tracking-tight text-navy"
          >
            Insider Accident Lawyers
          </a>
          <a
            href={PRIMARY_TEL_HREF}
            data-callrail-phone={PRIMARY_PHONE_DISPLAY}
            onClick={onCallClick}
            className="text-right"
          >
            <span className="block text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">
              Call now
            </span>
            <span className="font-display text-lg font-extrabold text-brand sm:text-xl">
              {PRIMARY_PHONE_DISPLAY}
            </span>
          </a>
        </div>
      </header>

      <CaseReviewChecker config={config} />

      <footer className="mx-auto mt-12 max-w-3xl px-4 pb-8 text-center text-sm text-slate-600 sm:px-6">
        <p className="font-semibold text-slate-800">Insider Accident Lawyers</p>
        <p className="mt-1">3435 Wilshire Blvd., Suite 1620, Los Angeles, CA 90010</p>
        <p className="mt-2">
          Attorney advertising. This page is general information, not legal advice. Past
          results do not guarantee a future outcome. Submitting a form does not create an
          attorney-client relationship.
        </p>
      </footer>

      <StickyCallBar visible onCallClick={onCallClick} />
    </main>
  );
}
