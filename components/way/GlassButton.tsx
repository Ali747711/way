import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type GlassVariant = 'blue' | 'yellow' | 'black' | 'white';

const VARIANT: Record<GlassVariant, string> = {
  blue: '',
  yellow: 'glass-yellow',
  black: 'glass-black',
  white: 'glass-white'
};

/**
 * Classes for a glass pill: 56px on a phone, 60px from `sm`. Also used on
 * links that act as buttons. The look lives in globals.css (`.glass`).
 */
export const glass = (variant: GlassVariant = 'blue', className?: string) =>
  cn('glass h-14 sm:h-15', VARIANT[variant], className);

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GlassVariant;
}

/**
 * The squishy glass button. A plain `<button>` rather than the shadcn one:
 * the glass draws its own fill, shadows and focus outline, and the
 * primitive's ring and fill utilities would fight them.
 */
export default function GlassButton({
  variant = 'blue',
  className,
  type = 'button',
  ...props
}: GlassButtonProps) {
  return (
    <button type={type} className={glass(variant, className)} {...props} />
  );
}
