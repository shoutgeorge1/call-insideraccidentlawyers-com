'use client';

import type { ChatMessage } from './types';

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isSystem = message.role === 'system';

  return (
    <div
      className={`chat-bubble-in flex w-full ${isSystem ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={
          isSystem
            ? 'max-w-[92%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-[15px] leading-snug text-slate-900 shadow-sm sm:max-w-[85%]'
            : 'max-w-[92%] rounded-2xl rounded-br-md bg-navy px-4 py-3 text-[15px] font-semibold leading-snug text-white shadow-sm sm:max-w-[85%]'
        }
      >
        {message.text}
      </div>
    </div>
  );
}
