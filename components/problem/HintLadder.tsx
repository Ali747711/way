import { Button } from '@/components/ui/button';

import { OUTLINE } from './buttonStyles';

interface HintLadderProps {
  hints: string[];
  revealed: number;
  maxHints: number;
  disabled: boolean;
  onHint: () => void;
}

export default function HintLadder({
  hints,
  revealed,
  maxHints,
  disabled,
  onHint
}: HintLadderProps) {
  const shown = hints.slice(0, revealed);
  const label = `Hint ${Math.min(revealed + 1, maxHints)} of ${maxHints}`;

  return (
    <div className="space-y-4">
      {/* Hints are questions in the margin: the text face, in italic. */}
      {shown.length > 0 && (
        <ol className="list-decimal space-y-2.5 pl-6 font-serif text-[1.0625rem] leading-relaxed text-pretty italic marker:font-sans marker:text-sm marker:text-muted-foreground marker:not-italic marker:[font-variant-numeric:normal]">
          {shown.map((hint, i) => (
            <li key={i} className="pl-1.5">
              {hint}
            </li>
          ))}
        </ol>
      )}
      <Button
        type="button"
        variant="outline"
        className={`${OUTLINE} gap-3 px-4 tabular-nums`}
        onClick={onHint}
        disabled={disabled || revealed >= maxHints}
      >
        {label}
        {/* The keyboard shortcut, shown where there is a keyboard. */}
        <kbd
          aria-hidden="true"
          className="hidden h-6 min-w-6 items-center justify-center rounded border border-border px-1.5 font-sans text-xs text-muted-foreground sm:inline-flex"
        >
          ?
        </kbd>
      </Button>
    </div>
  );
}
