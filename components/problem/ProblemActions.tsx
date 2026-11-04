import { Button } from '@/components/ui/button';

import { OUTLINE, PRIMARY, QUIET } from './buttonStyles';

interface ProblemActionsProps {
  terminal: boolean;
  isCode: boolean;
  busy: boolean;
  onRun: () => void;
  onSubmit: () => void;
  /** Opens the give-up confirmation; it does not give up by itself. */
  onAskGiveUp: () => void;
  onNext: () => void;
}

export default function ProblemActions({
  terminal,
  isCode,
  busy,
  onRun,
  onSubmit,
  onAskGiveUp,
  onNext
}: ProblemActionsProps) {
  if (terminal) {
    return (
      <Button type="button" size="lg" className={PRIMARY} onClick={onNext}>
        Next
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isCode && (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={OUTLINE}
          disabled={busy}
          onClick={onRun}
        >
          Run
        </Button>
      )}
      <Button
        type="button"
        size="lg"
        className={PRIMARY}
        disabled={busy}
        onClick={onSubmit}
      >
        Submit
      </Button>
      {/* The way out stays available but quieter than the way forward. */}
      <Button
        type="button"
        variant="ghost"
        size="lg"
        className={QUIET}
        onClick={onAskGiveUp}
      >
        Give up
      </Button>
    </div>
  );
}
