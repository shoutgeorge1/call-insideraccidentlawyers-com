'use client';

import { PRIMARY_PHONE_DISPLAY, PRIMARY_TEL_HREF } from '@/lib/site';

type IntroScreenProps = {
  headline: string;
  subheadline: string;
  startButtonText: string;
  onStart: () => void;
  onCallClick: () => void;
};

function IconPhone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

function IconShield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.5l2 2 4-4" />
    </svg>
  );
}

function IconClock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconLock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 12h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75A2.25 2.25 0 006.75 22.5z"
      />
    </svg>
  );
}

const TRUST = [
  {
    title: 'No fee unless we win',
    body: 'Free to start. No upfront legal fees.',
    Icon: IconShield,
  },
  {
    title: 'Fast case review',
    body: 'A short intake helps us understand the next step.',
    Icon: IconClock,
  },
  {
    title: 'Confidential',
    body: 'Your answers are private and reviewed by our team.',
    Icon: IconLock,
  },
  {
    title: 'Talk to a real person',
    body: 'Call now if you want help right away.',
    Icon: IconPhone,
  },
];

export function IntroScreen({
  headline,
  subheadline,
  startButtonText,
  onStart,
  onCallClick,
}: IntroScreenProps) {
  return (
    <div className="w-full">
      <section className="relative overflow-hidden bg-gradient-to-b from-navy via-[#0a2d5a] to-brand px-4 pb-10 pt-9 sm:px-6 sm:pb-14 sm:pt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-accent/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-[-10%] h-72 w-72 rounded-full bg-sky-300/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl">
          <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-navy shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Free case review · Takes under a minute
          </span>

          <h1 className="mt-5 font-display text-[2rem] font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl">
            {headline}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[17px] font-semibold leading-relaxed text-white sm:text-lg">
            {subheadline}
          </p>

          <div className="mt-7 rounded-2xl border border-white/15 bg-white/10 p-3 shadow-2xl shadow-slate-950/20 backdrop-blur sm:mx-auto sm:max-w-2xl sm:p-4">
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <button
              type="button"
              onClick={onStart}
              className="min-h-[58px] w-full rounded-xl bg-accent px-6 text-[17px] font-extrabold tracking-wide text-slate-950 shadow-lg shadow-amber-500/25 transition hover:bg-[#ffc42e] active:scale-[0.99] sm:flex-1 sm:text-lg"
            >
              {startButtonText}
            </button>
            <a
              href={PRIMARY_TEL_HREF}
              data-callrail-phone={PRIMARY_PHONE_DISPLAY}
              onClick={onCallClick}
              className="min-h-[54px] inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/70 bg-white px-5 text-[16px] font-extrabold text-navy shadow-sm transition hover:bg-slate-50 sm:flex-1"
            >
              <IconPhone className="h-5 w-5" />
              Or call {PRIMARY_PHONE_DISPLAY}
            </a>
            </div>
            <p className="mt-3 rounded-lg bg-navy/30 px-3 py-2 text-center text-sm font-bold text-white">
              Free · Confidential · No obligation
            </p>
          </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand">
              What happens next
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              Clear answers without pressure.
            </h2>
          </div>

          <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map(({ title, body, Icon }) => (
              <li
                key={title}
                className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 text-left shadow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-accent shadow-sm">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-[1rem] font-extrabold leading-tight text-slate-950">
                  {title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
