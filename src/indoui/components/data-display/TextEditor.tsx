import React, { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Code, Link as LinkIcon, Image, Heading1, Heading2, Quote } from 'lucide-react';

export type TextEditorSize = 'sm' | 'md' | 'lg';

export interface TextEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: TextEditorSize;
  minHeight?: string;
  maxHeight?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

const sizeClasses: Record<TextEditorSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const toolbarButtonClass = "p-2 rounded-md hover:bg-muted transition-colors disabled:opacity-50 text-muted-foreground hover:text-foreground";
const toolbarButtonActiveClass = "bg-primary/10 text-primary";

export const TextEditor: React.FC<TextEditorProps> = ({
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Start typing...',
  size = 'md',
  minHeight = '200px',
  maxHeight = '400px',
  disabled = false,
  readOnly = false,
  className,
}) => {
  const [content, setContent] = useState(defaultValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const displayValue = value !== undefined ? value : content;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange?.(newValue);
  }, [onChange]);

  const insertAtCursor = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = displayValue.substring(start, end);
    
    const newText = displayValue.substring(0, start) + before + selectedText + after + displayValue.substring(end);
    setContent(newText);
    onChange?.(newText);

    // Set cursor position after operation
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [displayValue, onChange]);

  const wrapSelection = useCallback((wrapper: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = displayValue.substring(start, end);
    
    if (selectedText) {
      const newText = displayValue.substring(0, start) + wrapper + selectedText + wrapper + displayValue.substring(end);
      setContent(newText);
      onChange?.(newText);
    } else {
      // Insert placeholder text
      const placeholderText = 'text';
      const newText = displayValue.substring(0, start) + wrapper + placeholderText + wrapper + displayValue.substring(end);
      setContent(newText);
      onChange?.(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + wrapper.length, start + wrapper.length + placeholderText.length);
      }, 0);
    }
  }, [displayValue, onChange]);

  const insertLinePrefix = useCallback((prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = displayValue.lastIndexOf('\n', start - 1) + 1;
    
    const newText = displayValue.substring(0, lineStart) + prefix + displayValue.substring(lineStart);
    setContent(newText);
    onChange?.(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  }, [displayValue, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          wrapSelection('**');
          break;
        case 'i':
          e.preventDefault();
          wrapSelection('_');
          break;
        case 'u':
          e.preventDefault();
          wrapSelection('__');
          break;
      }
    }
  }, [wrapSelection]);

  return (
    <div className={cn(
      "border border-border rounded-lg overflow-hidden bg-card",
      disabled && "opacity-50",
      className
    )}>
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center gap-0.5 p-2 border-b border-border bg-muted/30 flex-wrap">
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => wrapSelection('**')}
            disabled={disabled}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => wrapSelection('_')}
            disabled={disabled}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => wrapSelection('__')}
            disabled={disabled}
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => wrapSelection('~~')}
            disabled={disabled}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => wrapSelection('`')}
            disabled={disabled}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </button>
          
          <div className="w-px h-5 bg-border mx-1" />
          
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => insertLinePrefix('# ')}
            disabled={disabled}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => insertLinePrefix('## ')}
            disabled={disabled}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => insertLinePrefix('> ')}
            disabled={disabled}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </button>
          
          <div className="w-px h-5 bg-border mx-1" />
          
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => insertLinePrefix('- ')}
            disabled={disabled}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => insertLinePrefix('1. ')}
            disabled={disabled}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          
          <div className="w-px h-5 bg-border mx-1" />
          
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => insertAtCursor('[', '](url)')}
            disabled={disabled}
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => insertAtCursor('![alt](', ')')}
            disabled={disabled}
            title="Insert Image"
          >
            <Image className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Editor Area */}
      <textarea
        ref={textareaRef}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={cn(
          "w-full resize-none bg-transparent p-4 focus:outline-none font-mono",
          sizeClasses[size]
        )}
        style={{ minHeight, maxHeight }}
      />
      
      {/* Footer with markdown hint */}
      <div className="px-4 py-2 border-t border-border bg-muted/20">
        <p className="text-xs text-muted-foreground">
          Markdown supported: **bold**, _italic_, `code`, # heading, - list, [link](url)
        </p>
      </div>
    </div>
  );
};

export default TextEditor;