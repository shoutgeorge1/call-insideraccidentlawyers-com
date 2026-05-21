'use client';

import { useRef, useState } from 'react';
import { PRIMARY_PHONE_DISPLAY, PRIMARY_TEL_HREF } from '@/lib/site';
import type { AnswerMap, CaseReviewConfig, LeadTier, Question, ResultMessage } from './types';

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/ial.leads.2024@gmail.com';
const THANK_YOU = 'https://call.insideraccidentlawyers.com/thank-you.html';

type ContactFormProps = {
  config: CaseReviewConfig;
  questions: Question[];
  answers: AnswerMap;
  tier: LeadTier;
  resultMessage: ResultMessage;
  onSubmitted: () => void;
  onBack: () => void;
  onCallClick: () => void;
};

type Status = 'idle' | 'sending' | 'error';

function readUtmFromStorage(): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof window === 'undefined') return out;
  ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
    try {
      const v = window.localStorage.getItem(`ial_${k}`);
      if (v) out[k] = v;
    } catch {
      /* ignore */
    }
  });
  return out;
}

function answerLabel(questions: Question[], questionId: string, answerId: string): string {
  const q = questions.find((qq) => qq.id === questionId);
  if (!q) return answerId;
  return q.options.find((o) => o.id === answerId)?.label ?? answerId;
}

export function ContactForm({
  config,
  questions,
  answers,
  tier,
  resultMessage,
  onSubmitted,
  onBack,
  onCallClick,
}: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const formStartedRef = useRef(false);

  function onFieldFocus() {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data: Record<string, unknown> = Object.fromEntries(fd.entries());

    if (!data.text_consent) delete data.text_consent;
    data._subject =
      config.contactSubject ?? `Case Review – ${config.practiceArea} (${tier})`;
    data._template = 'table';
    data._captcha = 'false';
    data._next = THANK_YOU;
    data.practice_area = config.practiceArea;
    data.page_slug = config.pageSlug;
    data.lead_tier = tier;

    const utm = readUtmFromStorage();
    Object.assign(data, utm);

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('submit failed');
      await res.json().catch(() => null);
      onSubmitted();
      window.location.href = THANK_YOU;
    } catch {
      setStatus('error');
      try {
        form.submit();
      } catch {
        /* ignore */
      }
    }
  }

  const answerSummary = questions
    .map((q) => {
      const aId = answers[q.id];
      if (!aId) return null;
      return `${q.text} → ${answerLabel(questions, q.id, aId)}`;
    })
    .filter(Boolean)
    .join('\n');

  return (
    <section className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold leading-tight text-navy sm:text-3xl">
          {resultMessage.headline}
        </h2>
        {resultMessage.formIntro ? (
          <p className="mt-2 text-[15px] text-slate-600">{resultMessage.formIntro}</p>
        ) : (
          <p className="mt-2 text-[15px] text-slate-600">
            Share your contact info and a team member will reach out shortly.
          </p>
        )}
      </div>

      <a
        href={PRIMARY_TEL_HREF}
        data-callrail-phone={PRIMARY_PHONE_DISPLAY}
        onClick={onCallClick}
        className="mt-5 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-navy px-4 text-center text-[16px] font-bold text-white shadow-md transition hover:bg-brand active:scale-[0.99]"
      >
        Or call {PRIMARY_PHONE_DISPLAY}
      </a>

      <form
        onSubmit={onSubmit}
        action={FORM_ENDPOINT}
        method="POST"
        className="mt-6 space-y-4"
        noValidate
      >
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <input type="hidden" name="_subject" value={config.contactSubject ?? `Case Review – ${config.practiceArea} (${tier})`} />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_next" value={THANK_YOU} />
        <input type="hidden" name="practice_area" value={config.practiceArea} />
        <input type="hidden" name="page_slug" value={config.pageSlug} />
        <input type="hidden" name="lead_tier" value={tier} />
        <input type="hidden" name="quiz_answers_json" value={JSON.stringify(answers)} />
        <input type="hidden" name="quiz_answers_summary" value={answerSummary} />
        {questions.map((q) =>
          answers[q.id] ? (
            <input
              key={q.id}
              type="hidden"
              name={`q_${q.id}`}
              value={answerLabel(questions, q.id, answers[q.id])}
            />
          ) : null
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            First name *
            <input
              name="first_name"
              type="text"
              required
              autoComplete="given-name"
              onFocus={onFieldFocus}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[16px] outline-none ring-navy focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Last name *
            <input
              name="last_name"
              type="text"
              required
              autoComplete="family-name"
              onFocus={onFieldFocus}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[16px] outline-none ring-navy focus:ring-2"
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Phone *
          <input
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            onFocus={onFieldFocus}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[16px] outline-none ring-navy focus:ring-2"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Email *
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            onFocus={onFieldFocus}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[16px] outline-none ring-navy focus:ring-2"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Anything else we should know? (optional)
          <textarea
            name="notes"
            rows={3}
            onFocus={onFieldFocus}
            className="mt-1 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-[16px] outline-none ring-navy focus:ring-2"
            placeholder="Brief note about what happened or what you need help with."
          />
        </label>

        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            name="text_consent"
            value="yes"
            className="mt-1"
            defaultChecked
          />
          <span>
            I agree to receive calls, texts, and emails about my inquiry. Message and data
            rates may apply. Reply STOP to opt out.
          </span>
        </label>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full min-h-[54px] rounded-xl bg-accent text-[17px] font-extrabold text-slate-900 shadow-md transition hover:bg-[#ffc42e] disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : config.contactFormCta}
        </button>

        {status === 'error' ? (
          <p className="text-center text-sm text-red-600">
            Something went wrong. Please call {PRIMARY_PHONE_DISPLAY}.
          </p>
        ) : null}

        <p className="text-center text-xs leading-relaxed text-slate-500">
          Submitting this form does not create an attorney-client relationship and does not
          guarantee representation. A team member may contact you to learn more.
        </p>

        <button
          type="button"
          onClick={onBack}
          className="block w-full text-center text-sm text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-slate-800"
        >
          ← Back to results
        </button>
      </form>
    </section>
  );
}
