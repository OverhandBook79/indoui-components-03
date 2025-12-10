import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Code, Link as LinkIcon, Image } from 'lucide-react';

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

const toolbarButtonClass = "p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-50";

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
  const displayValue = value !== undefined ? value : content;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange?.(newValue);
  }, [onChange]);

  const execCommand = useCallback((command: string) => {
    // For a real implementation, we'd use contentEditable or a library like TipTap
    // This is a simplified version using textarea
    const textarea = document.getElementById('text-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = displayValue.substring(start, end);
    
    let newText = displayValue;
    let wrapper = '';

    switch (command) {
      case 'bold':
        wrapper = '**';
        break;
      case 'italic':
        wrapper = '_';
        break;
      case 'code':
        wrapper = '`';
        break;
      case 'strikethrough':
        wrapper = '~~';
        break;
      default:
        return;
    }

    if (selectedText) {
      newText = displayValue.substring(0, start) + wrapper + selectedText + wrapper + displayValue.substring(end);
      setContent(newText);
      onChange?.(newText);
    }
  }, [displayValue, onChange]);

  return (
    <div className={cn(
      "border border-border rounded-lg overflow-hidden bg-card",
      disabled && "opacity-50",
      className
    )}>
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30 flex-wrap">
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => execCommand('bold')}
            disabled={disabled}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => execCommand('italic')}
            disabled={disabled}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => execCommand('strikethrough')}
            disabled={disabled}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => execCommand('code')}
            disabled={disabled}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </button>
          
          <div className="w-px h-5 bg-border mx-1" />
          
          <button
            type="button"
            className={toolbarButtonClass}
            disabled={disabled}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            disabled={disabled}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          
          <div className="w-px h-5 bg-border mx-1" />
          
          <button
            type="button"
            className={toolbarButtonClass}
            disabled={disabled}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            disabled={disabled}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            disabled={disabled}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>
          
          <div className="w-px h-5 bg-border mx-1" />
          
          <button
            type="button"
            className={toolbarButtonClass}
            disabled={disabled}
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            disabled={disabled}
            title="Insert Image"
          >
            <Image className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Editor Area */}
      <textarea
        id="text-editor-textarea"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={cn(
          "w-full resize-none bg-transparent p-4 focus:outline-none",
          sizeClasses[size]
        )}
        style={{ minHeight, maxHeight }}
      />
    </div>
  );
};

export default TextEditor;
