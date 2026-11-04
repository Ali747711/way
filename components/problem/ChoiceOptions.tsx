import { useContentLang } from '@/components/i18n/LocaleProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { FIELD } from './fieldStyle';

interface ChoiceOptionsProps {
  options: string[];
  /** The problem title, which names the group. */
  title: string;
  draft: string;
  readOnly: boolean;
  onDraftChange: (draft: string) => void;
}

// Shown on the chosen option only; hidden from assistive technology, which
// reads aria-pressed instead.
const CHECK = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="hidden size-6 shrink-0 group-aria-pressed/button:block"
  >
    <circle cx="12" cy="12" r="11" fill="var(--blue-line)" />
    <path
      d="M7.5 12.5l3 3 6-6.5"
      fill="none"
      stroke="var(--on-blue)"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Options read as a list: left-aligned, and long ones wrap instead of
 * overflowing the phone width. Chosen is not colour alone: a 2px blue edge,
 * a tint and a check.
 */
export default function ChoiceOptions({
  options,
  title,
  draft,
  readOnly,
  onDraftChange
}: ChoiceOptionsProps) {
  return (
    <div
      className="flex flex-col gap-2.5"
      role="group"
      aria-label={title}
      lang={useContentLang()}
    >
      {options.map((option, i) => (
        <Button
          key={i}
          type="button"
          size="lg"
          variant="outline"
          aria-pressed={draft === String(i)}
          className={cn(
            FIELD,
            'h-auto min-h-14 justify-between gap-3 rounded-[18px] px-5 py-3.5 text-left text-[1.0625rem] font-medium whitespace-normal hover:bg-track hover:text-ink dark:border-field dark:hover:bg-track',
            'aria-pressed:border-2 aria-pressed:border-blue-line aria-pressed:bg-blue-tint aria-pressed:px-[1.1875rem] aria-pressed:py-[0.8125rem] dark:aria-pressed:border-blue-line dark:aria-pressed:bg-blue-tint'
          )}
          disabled={readOnly}
          onClick={() => onDraftChange(String(i))}
        >
          {option}
          {CHECK}
        </Button>
      ))}
    </div>
  );
}
