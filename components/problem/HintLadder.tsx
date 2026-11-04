import { useMessages } from '@/components/i18n/LocaleProvider';
import GlassButton from '@/components/way/GlassButton';

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
  const label = useMessages().problem.hint(
    Math.min(revealed + 1, maxHints),
    maxHints
  );

  return (
    <div className="space-y-4">
      {/* Hints are questions on a grey card, each behind a yellow number. */}
      {shown.length > 0 && (
        <ol
          role="list"
          className="hint-list space-y-3 rounded-[22px] bg-track p-4 text-[1.0625rem] leading-relaxed text-pretty"
        >
          {shown.map((hint, i) => (
            <li key={i} className="relative min-h-6.5 pl-10">
              {hint}
            </li>
          ))}
        </ol>
      )}
      <GlassButton
        variant="yellow"
        className="tabular-nums"
        onClick={onHint}
        disabled={disabled || revealed >= maxHints}
      >
        {label}
        {/* The keyboard shortcut, shown where there is likely a keyboard. */}
        <kbd
          aria-hidden="true"
          className="hidden size-6 items-center justify-center rounded-md border-[1.5px] border-current/40 font-sans text-xs font-black pointer-fine:inline-flex"
        >
          ?
        </kbd>
      </GlassButton>
    </div>
  );
}
