import React, { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { cn } from '@/lib/utils';
import { SizeKey } from '../../theme/tokens';
import { LayoutProps, getLayoutClasses } from '../../utils/layoutProps';
import { Copy, Check } from 'lucide-react';

export type Language =
  | 'javascript'
  | 'typescript'
  | 'jsx'
  | 'tsx'
  | 'css'
  | 'html'
  | 'json'
  | 'markdown'
  | 'python'
  | 'bash'
  | 'shell'
  | 'yaml'
  | 'sql'
  | 'graphql';

export interface SyntaxHighlighterProps extends LayoutProps {
  children?: string;
  language?: Language;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  theme?: 'dark' | 'light';
  size?: SizeKey;
  filename?: string;
  className?: string;
}

const sizeClasses: Record<SizeKey, string> = {
  xs: 'text-[10px] leading-4',
  sm: 'text-xs leading-5',
  md: 'text-sm leading-6',
  lg: 'text-base leading-7',
  xl: 'text-lg leading-8',
  '2xl': 'text-xl leading-9',
};

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({
  children,
  language = 'typescript',
  showLineNumbers = true,
  showCopyButton = true,
  theme = 'dark',
  size = 'sm',
  filename,
  className,
  ...layoutProps
}) => {
  const [copied, setCopied] = useState(false);
  
  const code = (children ?? '').trim();
  const prismTheme = theme === 'dark' ? themes.vsDark : themes.vsLight;
  const layoutClasses = getLayoutClasses(layoutProps);
  
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden border border-border',
        theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-[#ffffff]',
        layoutClasses,
        className
      )}
    >
      {/* Header with filename and copy button */}
      {(filename || showCopyButton) && (
        <div className={cn(
          'flex items-center justify-between px-4 py-2 border-b border-border',
          theme === 'dark' ? 'bg-[#252526] text-[#cccccc]' : 'bg-[#f3f3f3] text-[#616161]'
        )}>
          {filename && (
            <span className="text-xs font-medium">{filename}</span>
          )}
          {!filename && <span />}
          {showCopyButton && (
            <button
              onClick={copyCode}
              className={cn(
                'inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors',
                theme === 'dark' 
                  ? 'hover:bg-[#3c3c3c] text-[#cccccc]' 
                  : 'hover:bg-[#e4e4e4] text-[#616161]'
              )}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      )}
      
      {/* Code block */}
      <Highlight theme={prismTheme} code={code} language={language}>
        {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(
              highlightClassName,
              'overflow-auto p-4 m-0 font-mono',
              sizeClasses[size]
            )}
            style={{ ...style, margin: 0, background: 'transparent' }}
          >
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line, key: i });
              return (
                <div key={i} {...lineProps} className={cn(lineProps.className, 'table-row')}>
                  {showLineNumbers && (
                    <span 
                      className={cn(
                        'table-cell pr-4 select-none text-right',
                        theme === 'dark' ? 'text-[#858585]' : 'text-[#999999]'
                      )}
                    >
                      {i + 1}
                    </span>
                  )}
                  <span className="table-cell">
                    {line.map((token, key) => {
                      const tokenProps = getTokenProps({ token, key });
                      return <span key={key} {...tokenProps} />;
                    })}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

// Simple code block without syntax highlighting (for inline use)
export interface CodeBlockProps extends LayoutProps {
  children: string;
  size?: SizeKey;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  size = 'sm',
  className,
  ...layoutProps
}) => {
  const layoutClasses = getLayoutClasses(layoutProps);
  
  return (
    <pre
      className={cn(
        'bg-muted rounded-lg p-4 overflow-x-auto font-mono',
        sizeClasses[size],
        layoutClasses,
        className
      )}
    >
      <code>{children}</code>
    </pre>
  );
};
