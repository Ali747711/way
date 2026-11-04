import type { AccentedText } from '@/lib/i18n/messages';

/** Display heading text with its one accent word in red. */
export default function Accented({ text }: { text: AccentedText }) {
  return (
    <>
      {text.lead}
      <span className="text-red">{text.accent}</span>
      {text.tail}
    </>
  );
}
