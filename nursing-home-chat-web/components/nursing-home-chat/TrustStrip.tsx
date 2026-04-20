'use client';

export function TrustStrip() {
  const items = [
    'No fee unless we win',
    'Free consultation',
    '100% confidential',
  ];

  return (
    <ul className="mx-auto mt-8 flex max-w-lg flex-col gap-2 text-center text-sm font-medium text-slate-600 sm:flex-row sm:justify-center sm:gap-8">
      {items.map((t) => (
        <li key={t} className="flex items-center justify-center gap-2">
          <span
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
            aria-hidden
          />
          {t}
        </li>
      ))}
    </ul>
  );
}
