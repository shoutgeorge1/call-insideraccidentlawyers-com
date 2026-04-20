'use client';

import type { ChatMessage } from './types';
import type { AnswerOption } from './AnswerButtons';
import { MessageBubble } from './MessageBubble';
import { AnswerButtons } from './AnswerButtons';

type ChatContainerProps = {
  messages: ChatMessage[];
  options: AnswerOption[] | null;
  onSelect: (id: string) => void;
  inputLocked?: boolean;
};

export function ChatContainer({
  messages,
  options,
  onSelect,
  inputLocked,
}: ChatContainerProps) {
  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-lg shadow-slate-900/5 sm:p-5">
        <div className="flex min-h-[200px] flex-col gap-3">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </div>

        {options && options.length > 0 ? (
          <AnswerButtons
            options={options}
            onSelect={onSelect}
            disabled={inputLocked}
          />
        ) : null}
      </div>
    </div>
  );
}
