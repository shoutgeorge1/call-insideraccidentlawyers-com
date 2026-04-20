'use client';

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import { pushDataLayerEvent, trackTelClick } from '@/lib/dataLayer';
import { computeValueTier } from './scoring';
import { ChatContainer } from './ChatContainer';
import { TrustStrip } from './TrustStrip';
import { StickyCallBar } from './StickyCallBar';
import type { AnswerOption } from './AnswerButtons';
import type {
  ChatMessage,
  FlowAnswers,
  FlowPhase,
  Q1Answer,
  Q2Answer,
  Q3Answer,
  Q4Answer,
  ValueTier,
} from './types';

const ResultBlock = dynamic(
  () => import('./ResultBlock').then((m) => m.ResultBlock),
  {
    ssr: false,
    loading: () => (
      <div
        className="mx-auto mt-8 h-40 max-w-lg animate-pulse rounded-2xl bg-slate-100"
        aria-hidden
      />
    ),
  }
);

const Q1_TEXT = 'Was your loved one harmed or neglected in a nursing home?';
const Q2_TEXT = 'Did they suffer any of the following?';
const Q3_TEXT = 'Did this happen recently?';
const Q4_TEXT = 'Has anyone reported this or taken action?';

const Q1_OPTIONS: AnswerOption[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'not-sure', label: 'Not sure' },
  { id: 'no', label: 'No' },
];

const Q2_OPTIONS: AnswerOption[] = [
  { id: 'bed-sores', label: 'Bed sores / pressure ulcers' },
  { id: 'falls', label: 'Falls or broken bones' },
  { id: 'malnutrition', label: 'Malnutrition / dehydration' },
  { id: 'other', label: 'Other / not sure' },
];

const Q3_OPTIONS: AnswerOption[] = [
  { id: '30d', label: 'Within 30 days' },
  { id: '1-6mo', label: '1–6 months ago' },
  { id: '6mo+', label: 'Over 6 months ago' },
];

const Q4_OPTIONS: AnswerOption[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
  { id: 'not-yet', label: 'Not yet' },
];

function findLabel(options: AnswerOption[], id: string): string {
  return options.find((o) => o.id === id)?.label ?? id;
}

export type FlowStateHandle = {
  start: () => void;
};

export const FlowStateManager = forwardRef<FlowStateHandle, object>(
  function FlowStateManager(_, ref) {
    const idCounter = useRef(0);
    const nextId = () => {
      idCounter.current += 1;
      return `m-${idCounter.current}`;
    };

    const [phase, setPhase] = useState<FlowPhase>('idle');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [answers, setAnswers] = useState<FlowAnswers>({});
    const [tier, setTier] = useState<ValueTier | null>(null);
    const [inputLocked, setInputLocked] = useState(false);

    const trackCall = useCallback(() => {
      trackTelClick();
    }, []);

    const startChat = useCallback(() => {
      if (phase !== 'idle') return;
      pushDataLayerEvent('chat_started');
      setMessages([{ id: nextId(), role: 'system', text: Q1_TEXT }]);
      setPhase('q1');
    }, [phase]);

    useImperativeHandle(ref, () => ({ start: startChat }), [startChat]);

    const getOptionsForPhase = (): AnswerOption[] | null => {
      switch (phase) {
        case 'q1':
          return Q1_OPTIONS;
        case 'q2':
          return Q2_OPTIONS;
        case 'q3':
          return Q3_OPTIONS;
        case 'q4':
          return Q4_OPTIONS;
        default:
          return null;
      }
    };

    const finishWithTier = useCallback(
      (finalAnswers: FlowAnswers) => {
        const t = computeValueTier(finalAnswers);
        if (t === 'high') {
          pushDataLayerEvent('high_value_path');
        }
        setTier(t);
        setPhase('result');
      },
      []
    );

    const onSelect = (id: string) => {
      if (inputLocked || phase === 'idle' || phase === 'result') return;
      setInputLocked(true);

      if (phase === 'q1') {
        const label = findLabel(Q1_OPTIONS, id);
        const q1 = id as Q1Answer;
        if (q1 === 'yes') {
          pushDataLayerEvent('q1_yes');
        }

        setMessages((m) => [
          ...m,
          { id: nextId(), role: 'user', text: label },
        ]);

        if (q1 === 'no') {
          setAnswers({ q1 });
          setTier('low');
          setPhase('result');
          setInputLocked(false);
          return;
        }

        setAnswers({ q1 });
        setMessages((m) => [
          ...m,
          { id: nextId(), role: 'system', text: Q2_TEXT },
        ]);
        setPhase('q2');
        setInputLocked(false);
        return;
      }

      if (phase === 'q2') {
        pushDataLayerEvent('q2_injury_selected');
        const label = findLabel(Q2_OPTIONS, id);
        const q2 = id as Q2Answer;
        setAnswers((a) => ({ ...a, q2 }));
        setMessages((m) => [
          ...m,
          { id: nextId(), role: 'user', text: label },
          { id: nextId(), role: 'system', text: Q3_TEXT },
        ]);
        setPhase('q3');
        setInputLocked(false);
        return;
      }

      if (phase === 'q3') {
        const label = findLabel(Q3_OPTIONS, id);
        const q3 = id as Q3Answer;
        if (q3 === '30d' || q3 === '1-6mo') {
          pushDataLayerEvent('q3_recent');
        }
        setAnswers((a) => ({ ...a, q3 }));
        setMessages((m) => [
          ...m,
          { id: nextId(), role: 'user', text: label },
          { id: nextId(), role: 'system', text: Q4_TEXT },
        ]);
        setPhase('q4');
        setInputLocked(false);
        return;
      }

      if (phase === 'q4') {
        const label = findLabel(Q4_OPTIONS, id);
        const q4 = id as Q4Answer;
        const finalAnswers: FlowAnswers = { ...answers, q4 };
        setAnswers(finalAnswers);
        setMessages((m) => [
          ...m,
          { id: nextId(), role: 'user', text: label },
        ]);
        finishWithTier(finalAnswers);
        setInputLocked(false);
      }
    };

    const options = getOptionsForPhase();
    const showTrustDuringQuiz =
      phase === 'q1' ||
      phase === 'q2' ||
      phase === 'q3' ||
      phase === 'q4';
    const stickyDefaultVisible =
      phase === 'idle' || phase === 'q1' || phase === 'q2' || phase === 'q3' || phase === 'q4';
    const stickyAfterResult = phase === 'result' && tier !== null;

    const stickyVisible = stickyDefaultVisible || stickyAfterResult;
    const stickyVariant: 'default' | 'soft' =
      phase === 'result' && tier === 'low' ? 'soft' : 'default';

    const needsBottomPadding = stickyVisible;
    const showChat = phase !== 'idle' || messages.length > 0;

    return (
      <div
        id="nursing-home-chat-flow"
        className={`scroll-mt-4 ${needsBottomPadding ? 'pb-36 sm:pb-32' : ''}`}
      >
        {showChat ? (
          <ChatContainer
            messages={messages}
            options={options}
            onSelect={onSelect}
            inputLocked={inputLocked}
          />
        ) : (
          <div className="mx-auto w-full max-w-lg rounded-2xl border border-dashed border-slate-300 bg-slate-50/90 px-6 py-12 text-center shadow-inner">
            <p className="text-[17px] font-medium leading-relaxed text-slate-600">
              Tap &ldquo;Check If You Qualify&rdquo; above to begin your free
              case check.
            </p>
          </div>
        )}

        {showTrustDuringQuiz ? <TrustStrip /> : null}

        {phase === 'result' && tier ? (
          <>
            <ResultBlock tier={tier} onCallClick={trackCall} />
            <TrustStrip />
          </>
        ) : null}

        <StickyCallBar
          visible={stickyVisible}
          variant={stickyVariant}
          onCallClick={trackCall}
        />
      </div>
    );
  }
);
