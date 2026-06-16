"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { sendMessageSchema } from "@/lib/messages/schemas";

interface MessageComposerProps {
  onSend: (body: string) => Promise<void>;
  isPending: boolean;
}

export function MessageComposer({ onSend, isPending }: MessageComposerProps) {
  const t = useTranslations("messageComposer");
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 2000;

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;

    const parsed = sendMessageSchema.safeParse({ body: trimmed });
    if (!parsed.success) return;

    setText("");
    try {
      await onSend(parsed.data.body);
    } catch {
      setText(trimmed);
    }
  }, [text, isPending, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const charsLeft = maxLength - text.length;
  const isOverLimit = charsLeft < 0;

  return (
    <div className="border-t border-border-warm p-4 bg-surface-pure" role="region" aria-label={t("composerLabel")}>
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("placeholder")}
            maxLength={maxLength + 100}
            rows={2}
            className="w-full resize-none rounded-xl border border-border-warm bg-surface-pure px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label={t("messageInput")}
            disabled={isPending}
          />
          {text.length > 0 && (
            <span
              className={`absolute bottom-2 right-3 text-xs ${
                isOverLimit ? "text-red-500" : "text-neutral-soft"
              }`}
              aria-live="polite"
            >
              {charsLeft}
            </span>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={!text.trim() || isPending || isOverLimit}
          className="flex-shrink-0 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label={t("send")}
        >
          {isPending ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
