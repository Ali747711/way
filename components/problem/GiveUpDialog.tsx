import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

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
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-base leading-snug text-pretty">
            Show the solution? You can&apos;t retry today.
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="h-11 px-4 text-base"
            onClick={() => onOpenChange(false)}
          >
            Keep trying
          </Button>
          <Button
            type="button"
            className="h-11 px-4 text-base"
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
