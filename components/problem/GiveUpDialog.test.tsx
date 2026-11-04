import { useState } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import GiveUpDialog from '@/components/problem/GiveUpDialog';

function Harness({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Give up
      </button>
      <GiveUpDialog open={open} onOpenChange={setOpen} onConfirm={onConfirm} />
    </>
  );
}

describe('GiveUpDialog', () => {
  it('opens with focus on Keep trying, so Enter does not reveal the solution', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<Harness onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: 'Give up' }));
    const keepTrying = await screen.findByRole('button', {
      name: 'Keep trying'
    });
    await waitFor(() => expect(keepTrying).toHaveFocus());

    await user.keyboard('{Enter}');
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
