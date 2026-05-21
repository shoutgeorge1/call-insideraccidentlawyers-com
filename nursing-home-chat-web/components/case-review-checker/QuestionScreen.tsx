'use client';

import { ProgressBar } from './ProgressBar';
import type { Question } from './types';

type QuestionScreenProps = {
  question: Question;
  index: number;
  total: number;
  selectedId: string | undefined;
  onSelect: (optionId: string) => void;
  onBack: (() => void) | null;
};

export function QuestionScreen({
  question,
  index,
  total,
  selectedId,
  onSelect,
  onBack,
}: QuestionScreenProps) {
  return (
    <section
      aria-labelledby={`q-${question.id}-label`}
      className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 sm:p-7"
    >
      <ProgressBar current={index + 1} total={total} />

      <h2
        id={`q-${question.id}-label`}
        className="mt-5 font-display text-[1.45rem] font-extrabold leading-snug tracking-tight text-navy sm:text-2xl"
      >
        {question.text}
      </h2>
      {question.helper ? (
        <p className="mt-2 text-sm text-slate-600">{question.helper}</p>
      ) : null}

      <div className="mt-5 flex flex-col gap-3" role="radiogroup" aria-label={question.text}>
        {question.options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(opt.id)}
              className={
                'min-h-[54px] w-full rounded-xl border-2 px-4 py-3 text-left text-[16px] font-bold transition active:scale-[0.99] ' +
                (isSelected
                  ? 'border-accent bg-amber-50 text-slate-950 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-900 shadow-sm hover:border-accent hover:bg-amber-50/40')
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
          className="font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-950"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
          Free · Confidential
        </span>
      </div>
    </section>
  );
}
