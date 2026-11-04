import { useLayoutEffect, useRef, type KeyboardEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Answer } from '@/lib/content/schema';

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
      <div className="flex flex-col gap-2" role="group" aria-label={title}>
        {answer.options.map((option, i) => (
          <Button
            key={i}
            type="button"
            size="lg"
            variant={draft === String(i) ? 'default' : 'outline'}
            aria-pressed={draft === String(i)}
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
        className="h-12 text-lg"
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
      className={isCode ? 'min-h-48 font-mono text-sm' : 'min-h-32 text-lg'}
      onChange={(e) => onDraftChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
}
