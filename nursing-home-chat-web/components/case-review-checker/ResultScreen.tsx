'use client';

import type { LeadTier, ResultMessage } from './types';

type ResultScreenProps = {
  tier: LeadTier;
  message: ResultMessage;
  onContinue: () => void;
  onBack: () => void;
  continueLabel: string;
};

const TIER_ACCENT: Record<LeadTier, { ring: string; badge: string; badgeText: string }> = {
  high_review_priority: {
    ring: 'border-accent shadow-amber-500/20',
    badge: 'bg-accent text-slate-900',
    badgeText: 'Priority review',
  },
  standard_review: {
    ring: 'border-navy/20 shadow-slate-900/10',
    badge: 'bg-navy text-white',
    badgeText: 'Free case review',
  },
  needs_more_info: {
    ring: 'border-slate-300 shadow-slate-900/10',
    badge: 'bg-slate-700 text-white',
    badgeText: 'Quick follow-up',
  },
  likely_not_fit: {
    ring: 'border-slate-200 shadow-slate-900/5',
    badge: 'bg-slate-200 text-slate-700',
    badgeText: 'Optional review',
  },
};

export function ResultScreen({
  tier,
  message,
  onContinue,
  onBack,
  continueLabel,
}: ResultScreenProps) {
  const accent = TIER_ACCENT[tier];
  return (
    <section
      aria-live="polite"
      className={`result-fade-in mx-auto w-full max-w-lg rounded-2xl border-2 bg-white p-6 shadow-xl sm:p-8 ${accent.ring}`}
    >
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${accent.badge}`}
      >
        {accent.badgeText}
      </span>
      <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight text-navy sm:text-3xl">
        {message.headline}
      </h2>
      <p className="mt-3 text-[17px] leading-relaxed text-slate-700">{message.body}</p>

      <button
        type="button"
        onClick={onContinue}
        className="mt-6 flex min-h-[54px] w-full items-center justify-center rounded-xl bg-accent px-4 text-center text-[17px] font-extrabold text-slate-900 shadow-md transition hover:bg-[#ffc42e] active:scale-[0.99]"
      >
        {continueLabel}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="mt-3 w-full text-center text-sm text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-slate-800"
      >
        ← Edit my answers
      </button>
    </section>
  );
}
