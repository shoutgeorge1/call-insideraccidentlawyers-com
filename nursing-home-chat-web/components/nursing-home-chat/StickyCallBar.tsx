'use client';

import { PRIMARY_PHONE_DISPLAY, PRIMARY_TEL_HREF } from '@/lib/site';

type StickyCallBarProps = {
  visible: boolean;
  variant?: 'default' | 'soft';
  onCallClick: () => void;
};

export function StickyCallBar({
  visible,
  variant = 'default',
  onCallClick,
}: StickyCallBarProps) {
  if (!visible) return null;

  if (variant === 'soft') {
    return (
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 text-center text-sm text-slate-600 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-sm pb-[calc(0.75rem+var(--safe-bottom))]"
        role="status"
      >
        Your information stays private. We&apos;ll follow up by phone or email
        only if you request it.
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-accent bg-navy shadow-[0_-6px_24px_rgba(1,54,108,0.35)] pb-[calc(0.75rem+var(--safe-bottom))]">
      <div className="mx-auto flex max-w-lg flex-col gap-1 px-4 py-3">
        <a
          href={PRIMARY_TEL_HREF}
          data-callrail-phone={PRIMARY_PHONE_DISPLAY}
          onClick={onCallClick}
          className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-accent px-4 text-center text-[17px] font-extrabold tracking-wide text-slate-900 shadow-md transition hover:bg-[#ffc42e] active:scale-[0.99]"
        >
          Call Now – Free Case Review
        </a>
        <span className="text-center text-xs font-medium text-white/90">
          Tap to call {PRIMARY_PHONE_DISPLAY}
        </span>
      </div>
    </div>
  );
}
