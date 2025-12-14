import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';

export interface ClipboardProps {
  value: string;
  children?: React.ReactNode;
  timeout?: number;
  onCopy?: (value: string) => void;
  className?: string;
}

export interface ClipboardButtonProps {
  value: string;
  size?: 'sm' | 'md' | 'lg';
  timeout?: number;
  onCopy?: (value: string) => void;
  className?: string;
}

export const Clipboard: React.FC<ClipboardProps> = ({
  value,
  children,
  timeout = 2000,
  onCopy,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy?.(value);
      setTimeout(() => setCopied(false), timeout);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      {children || (
        <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
          {value}
        </code>
      )}
      <button
        onClick={handleCopy}
        className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        title={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

export const ClipboardButton: React.FC<ClipboardButtonProps> = ({
  value,
  size = 'md',
  timeout = 2000,
  onCopy,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy?.(value);
      setTimeout(() => setCopied(false), timeout);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sizeStyles = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground',
        sizeStyles[size],
        className
      )}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className={cn(iconSizes[size], 'text-green-500')} />
      ) : (
        <Copy className={iconSizes[size]} />
      )}
    </button>
  );
};

Clipboard.displayName = 'Clipboard';
ClipboardButton.displayName = 'ClipboardButton';