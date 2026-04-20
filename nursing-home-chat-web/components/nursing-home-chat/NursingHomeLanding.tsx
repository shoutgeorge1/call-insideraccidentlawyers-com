'use client';

import { useEffect, useRef } from 'react';
import { pushDataLayerPayload } from '@/lib/dataLayer';
import {
  FlowStateManager,
  type FlowStateHandle,
} from './FlowStateManager';

export function NursingHomeLanding() {
  const flowRef = useRef<FlowStateHandle>(null);
  const funnelContextPushed = useRef(false);

  useEffect(() => {
    if (funnelContextPushed.current) return;
    funnelContextPushed.current = true;
    pushDataLayerPayload({
      event: 'funnel_context',
      funnel_name: 'nursing_home_neglect_chat',
      page_path: '/nursing-home-chat-check',
    });
  }, []);

  function onHeroCta() {
    flowRef.current?.start();
    document
      .getElementById('nursing-home-chat-flow')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <main className="min-h-dvh bg-gradient-to-b from-slate-100 via-white to-white">
      <section className="mx-auto max-w-3xl px-4 pb-6 pt-10 sm:pb-10 sm:pt-14">
        <h1 className="font-display text-center text-[1.65rem] font-extrabold leading-tight tracking-tight text-navy sm:text-4xl">
          You may have a nursing home neglect case — but it depends.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-[17px] font-medium leading-relaxed text-slate-700 sm:text-lg">
          Answer a few quick questions to find out immediately.
        </p>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onHeroCta}
            className="min-h-[56px] w-full max-w-md rounded-xl bg-accent px-6 text-[17px] font-extrabold uppercase tracking-wide text-slate-900 shadow-lg shadow-amber-500/25 transition hover:bg-[#ffc42e] active:scale-[0.99] sm:min-h-[52px] sm:text-lg"
          >
            Check If You Qualify
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 pt-2">
        <FlowStateManager ref={flowRef} />
      </section>
    </main>
  );
}
