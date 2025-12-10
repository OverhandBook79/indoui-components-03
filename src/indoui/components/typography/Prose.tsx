import React from 'react';
import { cn } from '@/lib/utils';

// Mark - highlighted text
export interface MarkProps {
  children: React.ReactNode;
  colorScheme?: 'yellow' | 'green' | 'blue' | 'red' | 'purple';
  className?: string;
}

const markColors: Record<string, string> = {
  yellow: 'bg-yellow-200 dark:bg-yellow-900/50',
  green: 'bg-green-200 dark:bg-green-900/50',
  blue: 'bg-blue-200 dark:bg-blue-900/50',
  red: 'bg-red-200 dark:bg-red-900/50',
  purple: 'bg-purple-200 dark:bg-purple-900/50',
};

export const Mark: React.FC<MarkProps> = ({ children, colorScheme = 'yellow', className }) => (
  <mark className={cn('px-1 rounded', markColors[colorScheme], className)}>
    {children}
  </mark>
);

// Highlight - similar to mark but with different styling
export interface HighlightProps {
  children: React.ReactNode;
  query: string;
  className?: string;
}

export const Highlight: React.FC<HighlightProps> = ({ children, query, className }) => {
  if (!query || typeof children !== 'string') {
    return <>{children}</>;
  }

  const regex = new RegExp(`(${query})`, 'gi');
  const parts = children.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className={cn('bg-yellow-200 dark:bg-yellow-900/50 px-0.5 rounded', className)}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

// Blockquote
export interface BlockquoteProps {
  children: React.ReactNode;
  cite?: string;
  author?: string;
  className?: string;
}

export const Blockquote: React.FC<BlockquoteProps> = ({ children, cite, author, className }) => (
  <figure className={className}>
    <blockquote
      cite={cite}
      className={cn(
        'border-l-4 border-primary pl-4 py-2 italic text-muted-foreground',
        'bg-muted/30 rounded-r-md'
      )}
    >
      {children}
    </blockquote>
    {author && (
      <figcaption className="mt-2 text-sm text-muted-foreground">
        — {author}
      </figcaption>
    )}
  </figure>
);

// Prose - for rich text content
export interface ProseProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const proseSizes: Record<string, string> = {
  sm: 'prose-sm',
  md: 'prose-base',
  lg: 'prose-lg',
};

export const Prose: React.FC<ProseProps> = ({ children, size = 'md', className }) => (
  <div
    className={cn(
      'prose dark:prose-invert max-w-none',
      proseSizes[size],
      'prose-headings:text-foreground prose-p:text-muted-foreground',
      'prose-a:text-primary prose-strong:text-foreground',
      'prose-code:bg-muted prose-code:px-1 prose-code:rounded',
      className
    )}
  >
    {children}
  </div>
);

// Em - emphasis
export interface EmProps {
  children: React.ReactNode;
  className?: string;
}

export const Em: React.FC<EmProps> = ({ children, className }) => (
  <em className={cn('italic', className)}>{children}</em>
);

Mark.displayName = 'Mark';
Highlight.displayName = 'Highlight';
Blockquote.displayName = 'Blockquote';
Prose.displayName = 'Prose';
Em.displayName = 'Em';