import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { cn } from '@/lib/utils';
import { SizeKey } from '../../theme/tokens';
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

export interface SyntaxHighlighterProps {
  children?: string;
  value?: string;
  onChange?: (value: string) => void;
  editable?: boolean;
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
  value,
  onChange,
  editable = false,
  language = 'typescript',
  showLineNumbers = true,
  showCopyButton = true,
  theme = 'dark',
  size = 'sm',
  filename,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  
  const code = (value ?? children ?? '').trim();
  const prismTheme = theme === 'dark' ? themes.vsDark : themes.vsLight;
  
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  }, [onChange]);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Handle tab key for indentation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      onChange?.(newValue);
      // Set cursor position after tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  }, [code, onChange]);
  
  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden border border-border',
        theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-[#ffffff]',
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
      <div className="relative">
        <Highlight theme={prismTheme} code={code} language={language}>
          {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              ref={preRef}
              className={cn(
                highlightClassName,
                'overflow-auto p-4 m-0 font-mono',
                sizeClasses[size],
                editable && 'pointer-events-none'
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
        
        {/* Editable textarea overlay */}
        {editable && (
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            onScroll={syncScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className={cn(
              'absolute inset-0 w-full h-full p-4 font-mono bg-transparent text-transparent caret-white resize-none outline-none',
              sizeClasses[size],
              showLineNumbers && 'pl-12'
            )}
            style={{ caretColor: theme === 'dark' ? '#fff' : '#000' }}
          />
        )}
      </div>
    </div>
  );
};

// Simple code block without syntax highlighting (for inline use)
export interface CodeBlockProps {
  children: string;
  size?: SizeKey;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  size = 'sm',
  className,
}) => {
  return (
    <pre
      className={cn(
        'bg-muted rounded-lg p-4 overflow-x-auto font-mono',
        sizeClasses[size],
        className
      )}
    >
      <code>{children}</code>
    </pre>
  );
};
