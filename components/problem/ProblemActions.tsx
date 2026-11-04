import { QUIET } from '@/components/classes';
import { Button } from '@/components/ui/button';
import GlassButton from '@/components/way/GlassButton';

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

// Blue is the way forward, yellow is for trying, and the way out is quiet.
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
      <GlassButton className="min-w-36" onClick={onNext}>
        Next
      </GlassButton>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {isCode && (
        <GlassButton
          variant="yellow"
          className="min-w-24"
          disabled={busy}
          onClick={onRun}
        >
          Run
        </GlassButton>
      )}
      {/* Narrower beside Run, so Run, Submit and Give up share one row at
          375px. */}
      <GlassButton
        className={isCode ? 'min-w-28' : 'min-w-36'}
        disabled={busy}
        onClick={onSubmit}
      >
        Submit
      </GlassButton>
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
