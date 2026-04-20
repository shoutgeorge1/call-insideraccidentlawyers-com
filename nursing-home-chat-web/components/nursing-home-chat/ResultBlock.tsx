'use client';

import { useRef, useState } from 'react';
import { pushDataLayerPayload } from '@/lib/dataLayer';
import { PRIMARY_PHONE_DISPLAY, PRIMARY_TEL_HREF } from '@/lib/site';
import type { ValueTier } from './types';

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/ial.leads.2024@gmail.com';

type ResultBlockProps = {
  tier: ValueTier;
  onCallClick: () => void;
};

export function ResultBlock({ tier, onCallClick }: ResultBlockProps) {
  return (
    <section
      className="result-fade-in mx-auto mt-8 w-full max-w-lg"
      aria-live="polite"
    >
      {tier === 'high' ? (
        <HighResult onCallClick={onCallClick} />
      ) : tier === 'mid' ? (
        <MidResult onCallClick={onCallClick} />
      ) : (
        <LowResult />
      )}
    </section>
  );
}

function HighResult({ onCallClick }: { onCallClick: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-accent bg-gradient-to-b from-white to-slate-50 p-6 shadow-xl shadow-slate-900/10 sm:p-8">
      <h2 className="font-display text-2xl font-extrabold leading-tight text-navy sm:text-3xl">
        You may have a strong nursing home neglect case.
      </h2>
      <p className="mt-3 text-[17px] font-medium text-slate-700">
        Speak to a case specialist now. Time matters.
      </p>
      <a
        href={PRIMARY_TEL_HREF}
        data-callrail-phone={PRIMARY_PHONE_DISPLAY}
        onClick={onCallClick}
        className="mt-6 flex min-h-[56px] w-full items-center justify-center rounded-xl bg-accent px-4 text-center text-lg font-extrabold text-slate-900 shadow-lg transition hover:bg-[#ffc42e] active:scale-[0.99]"
      >
        CALL NOW — {PRIMARY_PHONE_DISPLAY}
      </a>
    </div>
  );
}

const FORM_NAME_MID = 'nursing_home_chat_mid';

function MidResult({ onCallClick }: { onCallClick: () => void }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  );
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const formStartedRef = useRef(false);

  function onFormFieldInteract() {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    pushDataLayerPayload({ event: 'form_start', form_name: FORM_NAME_MID });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Nursing home chat funnel — mid tier',
          _template: 'table',
          name,
          phone,
          source: 'nursing-home-chat-check',
        }),
      });
      if (!res.ok) throw new Error('submit failed');
      setStatus('sent');
      pushDataLayerPayload({ event: 'form_submit', form_name: FORM_NAME_MID });
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
      <h2 className="font-display text-2xl font-extrabold leading-tight text-navy sm:text-3xl">
        You may still have a case — let&apos;s confirm.
      </h2>
      <p className="mt-3 text-[17px] text-slate-700">
        The fastest path is a short call. You can also leave your details
        below.
      </p>
      <a
        href={PRIMARY_TEL_HREF}
        data-callrail-phone={PRIMARY_PHONE_DISPLAY}
        onClick={onCallClick}
        className="mt-5 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-navy px-4 text-center text-[17px] font-bold text-white shadow-md transition hover:bg-brand active:scale-[0.99]"
      >
        Call {PRIMARY_PHONE_DISPLAY}
      </a>

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4"
      >
        <p className="text-sm font-semibold text-slate-800">
          Optional — request a callback
        </p>
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={onFormFieldInteract}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[16px] outline-none ring-navy focus:ring-2"
            autoComplete="name"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Phone
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onFocus={onFormFieldInteract}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[16px] outline-none ring-navy focus:ring-2"
            autoComplete="tel"
          />
        </label>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-lg bg-slate-800 py-3 text-[16px] font-semibold text-white transition hover:bg-slate-900 disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Request a callback'}
        </button>
        {status === 'sent' ? (
          <p className="text-center text-sm font-medium text-green-700">
            Thanks — we&apos;ll be in touch shortly.
          </p>
        ) : null}
        {status === 'error' ? (
          <p className="text-center text-sm text-red-600">
            Something went wrong. Please call {PRIMARY_PHONE_DISPLAY}.
          </p>
        ) : null}
      </form>
    </div>
  );
}

const FORM_NAME_LOW = 'nursing_home_chat_low';

function LowResult() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  );
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const formStartedRef = useRef(false);

  function onFormFieldInteract() {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    pushDataLayerPayload({ event: 'form_start', form_name: FORM_NAME_LOW });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Nursing home chat funnel — low tier',
          _template: 'table',
          name,
          phone,
          source: 'nursing-home-chat-check',
        }),
      });
      if (!res.ok) throw new Error('submit failed');
      setStatus('sent');
      pushDataLayerPayload({ event: 'form_submit', form_name: FORM_NAME_LOW });
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
      <h2 className="font-display text-2xl font-extrabold leading-tight text-navy sm:text-3xl">
        We may not be able to help, but we can review your situation.
      </h2>
      <p className="mt-3 text-[17px] text-slate-700">
        Share your contact information if you&apos;d like a confidential
        review. No obligation.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={onFormFieldInteract}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-[16px] outline-none ring-navy focus:ring-2"
            autoComplete="name"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Phone
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onFocus={onFormFieldInteract}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-[16px] outline-none ring-navy focus:ring-2"
            autoComplete="tel"
          />
        </label>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-lg bg-navy py-3 text-[16px] font-semibold text-white transition hover:bg-brand disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Request a confidential review'}
        </button>
        {status === 'sent' ? (
          <p className="text-center text-sm font-medium text-green-700">
            Thank you. If we can help, we&apos;ll reach out.
          </p>
        ) : null}
        {status === 'error' ? (
          <p className="text-center text-sm text-red-600">
            Please try again or call our office when you&apos;re ready.
          </p>
        ) : null}
      </form>
    </div>
  );
}
