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
    <div className="space-y-3">
      {shown.length > 0 && (
        <ol className="list-decimal space-y-2 pl-6 text-base">
          {shown.map((hint, i) => (
            <li key={i}>{hint}</li>
          ))}
        </ol>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={onHint}
        disabled={disabled || revealed >= maxHints}
      >
        {label}
      </Button>
    </div>
  );
}
