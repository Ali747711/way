import ReactMarkdown from 'react-markdown';

import { cn } from '@/lib/utils';

interface MarkdownProps {
  children: string;
  className?: string;
}

// The typography plugin is not installed, so spacing is handled with
// arbitrary child selectors instead of `prose`. Every top-level block after
// the first gets the same gap, so lists and code keep the paragraph rhythm.
export default function Markdown({ children, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        'text-lg leading-relaxed text-pretty [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:wrap-break-word [&_li]:mt-1 [&_li]:pl-1 [&_li]:marker:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:px-3 [&_pre]:py-2.5 [&_pre]:text-base [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&>*+*]:mt-4',
        className
      )}
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
