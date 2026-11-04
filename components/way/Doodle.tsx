import { cn } from '@/lib/utils';

interface DoodleProps {
  className?: string;
}

// Hand-drawn strokes: round caps, about 2.25px, never quite straight.
// Decorative only, so every doodle is hidden from assistive technology.
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
} as const;

/** A short wavy stroke, beside the wordmark. */
export function Squiggle({ className }: DoodleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 28 12"
      className={cn('h-3 w-7', className)}
    >
      <path
        d="M2 8.5c3-4.5 5.5-5 7-2.2s3.6 3.9 6.2-.4 5.6-4.4 6.8-1.2 2.3 2.6 4-1"
        {...stroke}
      />
    </svg>
  );
}

/** A loose underline that runs the width of the word above it. */
export function Underline({ className }: DoodleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 10"
      preserveAspectRatio="none"
      className={cn('h-2.5 w-full', className)}
    >
      <path d="M2 6.5c18-3.5 34-4 52-2.4S92 7 118 3.5" {...stroke} />
    </svg>
  );
}

/** An arrow drawn in one stroke, pointing right. */
export function Arrow({ className }: DoodleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 44 18"
      className={cn('h-4.5 w-11', className)}
    >
      <path
        d="M2 11c9-2.8 22-4.6 37-3.6M31.5 2.5c3 1.6 5.6 3.3 7.6 5-2.6 1.9-5 4-7 6.6"
        {...stroke}
      />
    </svg>
  );
}
