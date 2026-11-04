import { useLayoutEffect, useRef, type KeyboardEvent } from 'react';

import { FOCUS_RING } from '@/components/classes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Answer } from '@/lib/content/schema';
import { cn } from '@/lib/utils';

// Fields sit on the raised paper with a 3:1 edge. Typed answers use the text
// serif, like writing on the page; code uses the mono.
const FIELD = cn(
  'rounded-lg border-input bg-card dark:bg-card focus-visible:border-ring',
  FOCUS_RING
);

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
    // Options read as a list: left-aligned, and long ones wrap instead of
    // overflowing the phone width.
    return (
      <div className="flex flex-col gap-2" role="group" aria-label={title}>
        {answer.options.map((option, i) => (
          <Button
            key={i}
            type="button"
            size="lg"
            variant="outline"
            aria-pressed={draft === String(i)}
            className={cn(
              FIELD,
              'h-auto min-h-12 justify-start px-4 py-3 text-left text-base font-normal whitespace-normal hover:bg-muted dark:hover:bg-muted',
              // Chosen reads as the amber edge and a faint lamp tint.
              'aria-pressed:border-ring aria-pressed:bg-primary/12 dark:aria-pressed:bg-primary/12'
            )}
            disabled={readOnly}
            onClick={() => onDraftChange(String(i))}
          >
            {option}
          </Button>
        ))}
      </div>
    );
  }

  if (answer.type === 'exact' || answer.type === 'number') {
    return (
      <Input
        value={draft}
        aria-label={title}
        inputMode={answer.type === 'number' ? 'decimal' : undefined}
        autoComplete="off"
        className={cn(
          FIELD,
          'h-12 px-3.5 font-serif text-[1.1875rem] md:text-[1.1875rem]'
        )}
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
          ? 'min-h-48 px-3.5 py-3 font-mono text-sm leading-relaxed md:text-sm'
          : 'min-h-36 px-3.5 py-3 font-serif text-[1.1875rem] leading-relaxed md:text-[1.1875rem]'
      )}
      onChange={(e) => onDraftChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
}
