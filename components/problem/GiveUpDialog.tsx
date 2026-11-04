import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { OUTLINE, PRIMARY } from './buttonStyles';

interface GiveUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function GiveUpDialog({
  open,
  onOpenChange,
  onConfirm
}: GiveUpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-6 rounded-xl p-5 ring-border sm:max-w-sm"
      >
        <DialogHeader>
          <DialogTitle className="text-xl leading-snug font-medium text-pretty">
            Show the solution? You can&apos;t retry today.
          </DialogTitle>
        </DialogHeader>
        {/* The footer drops the primitive's tinted band and joins the card. */}
        <DialogFooter className="-mx-5 -mb-5 rounded-b-xl border-border bg-transparent px-5 pt-4 pb-5">
          <Button
            type="button"
            variant="outline"
            className={OUTLINE}
            onClick={() => onOpenChange(false)}
          >
            Keep trying
          </Button>
          <Button
            type="button"
            className={PRIMARY}
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
