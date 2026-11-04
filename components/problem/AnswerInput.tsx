import { useLayoutEffect, useRef, type KeyboardEvent } from 'react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Answer } from '@/lib/content/schema';
import { cn } from '@/lib/utils';

import ChoiceOptions from './ChoiceOptions';
import { FIELD } from './fieldStyle';

interface AnswerInputProps {
  answer: Answer;
  title: string;
  draft: string;
  readOnly: boolean;
  busy: boolean;
  onDraftChange: (draft: string) => void;
  onSubmit: () => void;
}

export default function AnswerInput({
  answer,
  title,
  draft,
  readOnly,
  busy,
  onDraftChange,
  onSubmit
}: AnswerInputProps) {
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const pendingCaret = useRef<number | null>(null);
  const canSubmit = !busy && !readOnly;

  // Restore the caret once the parent's new draft has actually rendered.
  useLayoutEffect(() => {
    if (pendingCaret.current === null || !areaRef.current) return;
    areaRef.current.setSelectionRange(
      pendingCaret.current,
      pendingCaret.current
    );
    pendingCaret.current = null;
  }, [draft]);

  if (answer.type === 'choice') {
    return (
      <ChoiceOptions
        options={answer.options}
        title={title}
        draft={draft}
        readOnly={readOnly}
        onDraftChange={onDraftChange}
      />
    );
  }

  if (answer.type === 'exact' || answer.type === 'number') {
    return (
      <Input
        value={draft}
        aria-label={title}
        inputMode={answer.type === 'number' ? 'decimal' : undefined}
        autoComplete="off"
        className={cn(FIELD, 'h-14 px-5 text-[1.0625rem] md:text-[1.0625rem]')}
        readOnly={readOnly}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && canSubmit) onSubmit();
        }}
      />
    );
  }

  const isCode = answer.type === 'code';

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (canSubmit) onSubmit();
      return;
    }
    if (isCode && e.key === 'Tab' && !e.shiftKey && !readOnly) {
      e.preventDefault();
      const el = e.currentTarget;
      const { selectionStart, selectionEnd, value } = el;
      onDraftChange(
        `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`
      );
      pendingCaret.current = selectionStart + 2;
    }
  };

  return (
    <Textarea
      ref={areaRef}
      value={draft}
      aria-label={title}
      placeholder={isCode ? answer.signature : undefined}
      spellCheck={!isCode}
      readOnly={readOnly}
      className={cn(
        FIELD,
        isCode
          ? 'min-h-48 rounded-[18px] bg-track px-4 py-3.5 font-mono text-sm leading-relaxed md:text-sm dark:bg-track'
          : 'min-h-36 rounded-[18px] px-5 py-4 text-[1.0625rem] leading-relaxed md:text-[1.0625rem]'
      )}
      onChange={(e) => onDraftChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
}
