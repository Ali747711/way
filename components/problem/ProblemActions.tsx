import { QUIET } from '@/components/classes';
import { useMessages } from '@/components/i18n/LocaleProvider';
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
  const t = useMessages().problem;
  if (terminal) {
    return (
      <GlassButton className="min-w-36" onClick={onNext}>
        {t.next}
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
          {t.run}
        </GlassButton>
      )}
      {/* Narrower beside Run, so Run, Submit and Give up share one row at
          375px. */}
      <GlassButton
        className={isCode ? 'min-w-28' : 'min-w-36'}
        disabled={busy}
        onClick={onSubmit}
      >
        {t.submit}
      </GlassButton>
      <Button
        type="button"
        variant="ghost"
        size="lg"
        className={QUIET}
        onClick={onAskGiveUp}
      >
        {t.giveUp}
      </Button>
    </div>
  );
}
