import ReactMarkdown from 'react-markdown';

import { cn } from '@/lib/utils';

interface MarkdownProps {
  children: string;
  className?: string;
}

// Problem prose in Figtree at reading size. The typography plugin is not
// installed, so spacing is handled with child selectors: every top-level
// block after the first gets the same gap, so lists and code keep the
// paragraph rhythm. A quoted clue becomes a white card, code sits on the
// grey track in the mono.
const PROSE = [
  'max-w-[66ch] text-[1.0625rem] leading-[1.6] text-pretty sm:text-[1.125rem] [&>*+*]:mt-4',
  '[&_a]:font-semibold [&_a]:text-blue-line [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-4',
  '[&_blockquote]:rounded-[18px] [&_blockquote]:border [&_blockquote]:border-hairline [&_blockquote]:bg-surface [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:font-semibold [&_blockquote]:shadow-[0_1px_2px_rgb(0_0_0/0.04)]',
  '[&_code]:rounded-md [&_code]:bg-track [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:wrap-break-word',
  '[&_pre]:overflow-x-auto [&_pre]:rounded-[18px] [&_pre]:bg-track [&_pre]:px-4 [&_pre]:py-3 [&_pre]:text-[0.875rem] [&_pre]:leading-relaxed',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
  '[&_li]:mt-1.5 [&_li]:pl-1 [&_li]:marker:text-ink-muted [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6',
  '[&_strong]:font-bold'
].join(' ');

export default function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={cn(PROSE, className)}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
