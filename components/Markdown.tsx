import ReactMarkdown from 'react-markdown';

import { cn } from '@/lib/utils';

interface MarkdownProps {
  children: string;
  className?: string;
}

// The typography plugin is not installed, so spacing is handled with
// arbitrary child selectors instead of `prose`.
export default function Markdown({ children, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        'text-lg leading-relaxed [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.9em] [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p+p]:mt-4 [&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:list-disc [&_ul]:pl-6',
        className
      )}
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
