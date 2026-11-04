import { QUIET } from '@/components/classes';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import GlassButton from '@/components/way/GlassButton';

interface GiveUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

// Showing the solution can't be undone, so it is the quiet choice and
// "Keep trying" is the blue one. The zoom and fade are dropped under
// reduced motion.
export default function GiveUpDialog({
  open,
  onOpenChange,
  onConfirm
}: GiveUpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-6 rounded-[28px] bg-surface p-6 shadow-overlay ring-hairline motion-reduce:animate-none! sm:max-w-sm"
      >
        <DialogHeader>
          <DialogTitle className="text-[1.375rem] leading-tight font-extrabold tracking-[-0.015em] text-pretty">
            Show the solution? You can&apos;t retry today.
          </DialogTitle>
        </DialogHeader>
        {/* Keep trying comes first in the DOM, so it takes the dialog's
            initial focus and Enter keeps the problem open. On a phone it
            sits on top; from sm the row is reversed so it sits at the
            right. */}
        <DialogFooter className="-mx-6 -mb-6 flex-col gap-2 rounded-b-[28px] border-0 bg-transparent px-6 pt-0 pb-6 sm:flex-row-reverse sm:items-center sm:justify-start">
          <GlassButton
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Keep trying
          </GlassButton>
          <Button
            type="button"
            variant="ghost"
            className={QUIET}
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
          >
            Show solution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
