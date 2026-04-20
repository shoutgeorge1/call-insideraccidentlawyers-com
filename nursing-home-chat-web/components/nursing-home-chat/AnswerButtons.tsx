'use client';

export type AnswerOption = {
  id: string;
  label: string;
};

type AnswerButtonsProps = {
  options: AnswerOption[];
  onSelect: (id: string) => void;
  disabled?: boolean;
};

export function AnswerButtons({
  options,
  onSelect,
  disabled,
}: AnswerButtonsProps) {
  return (
    <div className="mt-4 flex w-full flex-col gap-3 sm:mt-5">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(opt.id)}
          className="min-h-[52px] w-full rounded-xl border-2 border-navy/15 bg-white px-4 py-3 text-left text-[16px] font-semibold text-navy shadow-sm transition hover:border-accent hover:bg-amber-50/50 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
