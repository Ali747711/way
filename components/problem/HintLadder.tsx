import { Button } from '@/components/ui/button';

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
      {shown.length > 0 && (
        <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed text-pretty marker:text-muted-foreground">
          {shown.map((hint, i) => (
            <li key={i} className="pl-1">
              {hint}
            </li>
          ))}
        </ol>
      )}
      <Button
        type="button"
        variant="outline"
        className="h-11 px-4 text-base tabular-nums"
        onClick={onHint}
        disabled={disabled || revealed >= maxHints}
      >
        {label}
      </Button>
    </div>
  );
}
