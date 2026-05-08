'use client';

import { useCallback, useEffect, useState } from 'react';
import { StickyCallBar } from '@/components/nursing-home-chat/StickyCallBar';
import { pushDataLayerPayload, trackTelClick } from '@/lib/dataLayer';
import { PRIMARY_PHONE_DISPLAY, PRIMARY_TEL_HREF } from '@/lib/site';

const FORMSUBMIT = 'https://formsubmit.co/ajax/ial.leads.2024@gmail.com';
const THANK_YOU = 'https://call.insideraccidentlawyers.com/thank-you.html';

function IconPhone(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function IconCheckCircle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconLock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 12h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75A2.25 2.25 0 006.75 22.5z" />
    </svg>
  );
}

const trustItems = [
  { text: 'No fee unless we win', Icon: IconCheckCircle },
  { text: 'Fast case review', Icon: IconClock },
  { text: '100% confidential', Icon: IconLock },
  { text: 'Real people on the phone', Icon: IconPhone },
];

const familiarLines = [
  'You went in for something routine—then something changed fast.',
  'You’re dealing with symptoms you didn’t see coming.',
  'You’re not getting straight answers.',
  'You keep wondering: did something go wrong?',
];

const scenarioCards = [
  { title: 'Medication or prescription issues', sub: 'New symptoms after a drug, dose change, or something that doesn’t add up.' },
  { title: 'Medical or surgical care', sub: 'Complications, a bad result, or care that felt rushed or unclear.' },
  { title: 'Nursing home or care facility', sub: 'Falls, pressure injuries, sudden decline, or staff who won’t explain.' },
  { title: 'Injury after a procedure', sub: 'Worse than you were told, or a recovery that’s nothing like you expected.' },
  { title: 'Something serious appeared suddenly', sub: 'A diagnosis or event that came out of nowhere and turned life upside down.' },
];

const checklist = [
  'Something changed after treatment, a procedure, or a medication',
  'Your condition got worse in a way no one really warned you about',
  'ER visit, hospital stay, or symptoms that stopped normal life',
  "You have a gut feeling that something wasn’t handled right",
];

const faq = [
  {
    q: 'Do I have to know exactly what went wrong?',
    a: 'No. Most people who call are confused. We ask questions to sort out what might matter for you.',
  },
  {
    q: "What if I'm not even sure I have a case?",
    a: "That's fine. A short call is how you find out. No pressure to do anything you don't want.",
  },
  {
    q: 'What happens if I call?',
    a: 'Someone listens, asks a few clear questions, and tells you the next step—usually whether a lawyer should review the facts.',
  },
];

export function InjuryHelpPage() {
  const [submitting, setSubmitting] = useState(false);
  const onCall = useCallback(() => trackTelClick(), []);

  useEffect(() => {
    pushDataLayerPayload({
      event: 'funnel_context',
      funnel_name: 'injury_help_landing',
      page_path: '/injury-help',
    });
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    if (!data.text_consent) delete data.text_consent;
    data._subject = 'Injury Help - Universal capture LP';
    data._template = 'table';
    data._captcha = 'false';
    data._next = THANK_YOU;
    try {
      ['gclid', 'utm_source', 'utm_medium', 'utm_campaign'].forEach((k) => {
        try {
          const v = localStorage.getItem(`ial_${k}`);
          if (v) data[k] = v;
        } catch {
          /* ignore */
        }
      });
    } catch {
      /* ignore */
    }
    try {
      const r = await fetch(FORMSUBMIT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      await r.json();
      window.location.href = THANK_YOU;
    } catch {
      setSubmitting(false);
      form.submit();
    }
  }

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a href="https://call.insideraccidentlawyers.com/" className="font-display text-lg font-extrabold tracking-tight text-navy">
            Insider Accident Lawyers
          </a>
          <a
            href={PRIMARY_TEL_HREF}
            data-callrail-phone={PRIMARY_PHONE_DISPLAY}
            onClick={() => trackTelClick()}
            className="text-right"
          >
            <span className="block text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Call now</span>
            <span className="font-display text-lg font-extrabold text-brand sm:text-xl">{PRIMARY_PHONE_DISPLAY}</span>
          </a>
        </div>
      </header>

      <section className="bg-gradient-to-b from-navy via-[#0a2d5a] to-brand px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl sm:text-5xl">
            Something doesn&apos;t feel right after a medical treatment?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[17px] font-medium leading-relaxed text-slate-200 sm:text-lg">
            If something went wrong, you don&apos;t need the perfect words—and you don&apos;t need a label for your case yet. You just need
            a straight conversation about what happened.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <a
              href={PRIMARY_TEL_HREF}
              data-callrail-phone={PRIMARY_PHONE_DISPLAY}
              onClick={() => trackTelClick()}
              className="inline-flex min-h-[56px] w-full max-w-md items-center justify-center gap-2 self-center rounded-xl bg-accent px-6 text-[17px] font-extrabold text-slate-900 shadow-lg shadow-amber-500/30 transition hover:bg-[#ffc42e] sm:w-auto"
            >
              <IconPhone className="h-5 w-5" />
              Call {PRIMARY_PHONE_DISPLAY} — free review
            </a>
            <a
              href="#qualify"
              className="min-h-[52px] inline-flex w-full max-w-md items-center justify-center self-center rounded-xl border-2 border-white/40 bg-transparent px-5 text-center text-[16px] font-extrabold text-white transition hover:border-white/70 hover:bg-white/10 sm:w-auto"
            >
              See if you may qualify
            </a>
          </div>
          <p className="mt-3 text-sm font-medium text-slate-300">Free · Confidential · No obligation</p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {trustItems.map(({ text, Icon }) => (
              <li
                key={text}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-left text-sm font-semibold text-slate-800"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                  <Icon className="h-5 w-5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="font-display text-center text-2xl font-extrabold text-navy sm:text-3xl">This might sound familiar</h2>
        <ul className="mt-8 space-y-4 text-[17px] font-medium leading-relaxed text-slate-700">
          {familiarLines.map((line) => (
            <li key={line} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <a
            href={PRIMARY_TEL_HREF}
            data-callrail-phone={PRIMARY_PHONE_DISPLAY}
            onClick={() => trackTelClick()}
            className="font-display text-lg font-extrabold text-brand underline decoration-2 underline-offset-4"
          >
            Call {PRIMARY_PHONE_DISPLAY}
          </a>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-display text-center text-2xl font-extrabold text-navy sm:text-3xl">Situations we often hear about</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">Broad categories—your story is still the part that matters.</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scenarioCards.map((c) => (
              <li key={c.title} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm">
                <span className="text-lg font-bold text-slate-900">{c.title}</span>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.sub}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-slate-100 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-center text-2xl font-extrabold text-navy sm:text-3xl">Not everything is a legal case</h2>
          <p className="mx-auto mt-4 text-center text-[17px] font-medium leading-relaxed text-slate-700">
            But sometimes harm happens because a risk wasn&apos;t explained, a standard wasn&apos;t followed, or something was missed. That&apos;s when
            a legal review can matter. You won&apos;t know from a web page—talking is the honest next step.
          </p>
        </div>
      </section>

      <section id="qualify" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="font-display text-center text-2xl font-extrabold text-navy sm:text-3xl">Does any of this sound like you?</h2>
        <ul className="mt-8 space-y-3">
          {checklist.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left text-[16px] font-semibold text-slate-800 shadow-sm"
            >
              <IconCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <a
            href={PRIMARY_TEL_HREF}
            data-callrail-phone={PRIMARY_PHONE_DISPLAY}
            onClick={() => trackTelClick()}
            className="inline-flex min-h-[54px] min-w-[200px] items-center justify-center rounded-xl bg-accent px-8 text-[17px] font-extrabold text-slate-900 shadow-md hover:bg-[#ffc42e]"
          >
            Call {PRIMARY_PHONE_DISPLAY}
          </a>
        </div>
      </section>

      <section id="form" className="border-t border-slate-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <h2 className="font-display text-center text-2xl font-extrabold text-navy">Quick form (optional)</h2>
          <p className="mt-2 text-center text-sm text-slate-600">Prefer to type? Takes about 30 seconds. Calling is still fastest.</p>
          <p className="text-center text-sm font-semibold text-brand">
            <a href={PRIMARY_TEL_HREF} data-callrail-phone={PRIMARY_PHONE_DISPLAY} onClick={() => trackTelClick()}>
              {PRIMARY_PHONE_DISPLAY}
            </a>
          </p>
          <form
            onSubmit={onSubmit}
            className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-6"
            action="https://formsubmit.co/ial.leads.2024@gmail.com"
            method="POST"
          >
            <input type="hidden" name="_subject" value="Injury Help - Universal capture LP" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_next" value={THANK_YOU} />
            <div>
              <label htmlFor="ih-name" className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Name *
              </label>
              <input
                id="ih-name"
                name="full_name"
                type="text"
                required
                autoComplete="name"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-brand focus:ring-2"
              />
            </div>
            <div>
              <label htmlFor="ih-phone" className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Phone *
              </label>
              <input
                id="ih-phone"
                name="phone"
                type="tel"
                required
                inputMode="numeric"
                autoComplete="tel"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-brand focus:ring-2"
              />
            </div>
            <div>
              <label htmlFor="ih-story" className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                In your own words, what happened? *
              </label>
              <textarea
                id="ih-story"
                name="what_happened"
                required
                rows={4}
                placeholder="Treatment, symptoms, and what worries you"
                className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-brand focus:ring-2"
              />
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" name="text_consent" id="ih-sms" value="yes" className="mt-1" />
              <label htmlFor="ih-sms" className="text-sm text-slate-600">
                I agree to receive calls and texts about my inquiry. Message and data rates may apply. Reply STOP to opt out.
              </label>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[52px] rounded-xl bg-navy text-[16px] font-extrabold text-white transition hover:bg-[#012a5c] disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Request a call back'}
            </button>
            <p className="text-center text-xs text-slate-500">We’ll reach out quickly. No cold spam.</p>
          </form>
        </div>
      </section>

      <section className="bg-slate-100 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="font-display text-center text-2xl font-extrabold text-navy sm:text-3xl">Common questions</h2>
          <dl className="mt-8 space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                <dt className="font-bold text-slate-900">{item.q}</dt>
                <dd className="mt-2 text-slate-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-gradient-to-b from-navy to-[#0a2d5a] px-4 py-16 text-center sm:px-6 sm:py-20">
        <h2 className="font-display mx-auto max-w-lg text-2xl font-extrabold text-white sm:text-3xl">
          If something doesn&apos;t feel right, talk to someone now.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-slate-200">You can leave the legal labels to us. Start with a conversation.</p>
        <a
          href={PRIMARY_TEL_HREF}
          data-callrail-phone={PRIMARY_PHONE_DISPLAY}
          onClick={() => trackTelClick()}
          className="mt-8 inline-flex min-h-[58px] min-w-[200px] items-center justify-center rounded-xl bg-accent px-8 text-lg font-extrabold text-slate-900 shadow-lg hover:bg-[#ffc42e]"
        >
          Call {PRIMARY_PHONE_DISPLAY}
        </a>
        <p className="mt-3">
          <a
            href="#form"
            className="text-sm font-semibold text-slate-300 underline underline-offset-2 hover:text-white"
            onClick={() => pushDataLayerPayload({ event: 'injury_help_form_jump' })}
          >
            Use the short form instead
          </a>
        </p>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600 sm:px-6">
        <p className="font-semibold text-slate-800">Insider Accident Lawyers</p>
        <p className="mt-1">3435 Wilshire Blvd., Suite 1620, Los Angeles, CA 90010</p>
        <p className="mt-2">Attorney advertising. This page is general information, not legal advice. Past results do not guarantee a future outcome.</p>
      </footer>

      <StickyCallBar visible onCallClick={onCall} />
    </div>
  );
}

export default InjuryHelpPage;
