import ReactMarkdown from 'react-markdown';

import { cn } from '@/lib/utils';

interface MarkdownProps {
  children: string;
  className?: string;
}

// Problem prose is set in the text serif. The typography plugin is not
// installed, so spacing is handled with child selectors: every top-level
// block after the first gets the same gap, so lists and code keep the
// paragraph rhythm. Code uses the mono; quotes are set in italic against a
// hairline, like a clue copied into a notebook.
const PROSE = [
  'font-serif text-[1.1875rem] leading-[1.6] text-pretty sm:text-[1.25rem] [&>*+*]:mt-4',
  '[&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4',
  '[&_blockquote]:border-l [&_blockquote]:border-input [&_blockquote]:pl-4 [&_blockquote]:italic',
  '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.84em] [&_code]:wrap-break-word',
  '[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:px-4 [&_pre]:py-3 [&_pre]:text-[0.95rem] [&_pre]:leading-relaxed',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
  '[&_li]:mt-1.5 [&_li]:pl-1 [&_li]:marker:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6',
  '[&_strong]:font-semibold'
].join(' ');

export default function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={cn(PROSE, className)}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
