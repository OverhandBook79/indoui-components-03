import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo, Link as LinkIcon, Type, ChevronDown } from 'lucide-react';
import { LayoutProps, getLayoutClasses } from '../../utils/layoutProps';

export type TextEditorSize = 'sm' | 'md' | 'lg';

export interface TextEditorProps extends LayoutProps {
  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  size?: TextEditorSize;
  minHeight?: string;
  maxHeight?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

const fontFamilies = [
  { name: 'Default', value: '' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
];

const fontSizes = [
  { name: '10', value: '1' },
  { name: '12', value: '2' },
  { name: '14', value: '3' },
  { name: '16', value: '4' },
  { name: '18', value: '5' },
  { name: '24', value: '6' },
  { name: '32', value: '7' },
];

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
  ...layoutProps
}) => {
  const layoutClasses = getLayoutClasses(layoutProps);
  const editorRef = useRef<HTMLDivElement>(null);
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [currentFont, setCurrentFont] = useState('Default');
  const [currentSize, setCurrentSize] = useState('14');

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  useEffect(() => {
    if (editorRef.current && defaultValue && !value) {
      editorRef.current.innerHTML = defaultValue;
    }
  }, []);

  const execCommand = useCallback((command: string, value: string = '') => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleChange();
  }, []);

  const handleChange = useCallback(() => {
    if (editorRef.current) {
      onChange?.(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleFontFamily = (font: typeof fontFamilies[0]) => {
    setCurrentFont(font.name);
    setShowFontFamily(false);
    if (font.value) {
      execCommand('fontName', font.value);
    }
  };

  const handleFontSize = (size: typeof fontSizes[0]) => {
    setCurrentSize(size.name);
    setShowFontSize(false);
    execCommand('fontSize', size.value);
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            execCommand('redo');
          } else {
            execCommand('undo');
          }
          break;
      }
    }
  }, [execCommand]);

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  return (
    <div className={cn(
      "border border-border rounded-lg overflow-hidden bg-card",
      disabled && "opacity-50 pointer-events-none",
      layoutClasses,
      className
    )}>
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center gap-0.5 p-2 border-b border-border bg-muted/30 flex-wrap">
          {/* Undo/Redo */}
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => execCommand('undo')}
            disabled={disabled}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => execCommand('redo')}
            disabled={disabled}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="h-4 w-4" />
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Font Family Dropdown */}
          <div className="relative">
            <button
              type="button"
              className={cn(toolbarButtonClass, "flex items-center gap-1 min-w-[100px] justify-between")}
              onClick={() => { setShowFontFamily(!showFontFamily); setShowFontSize(false); }}
              disabled={disabled}
            >
              <span className="text-xs truncate">{currentFont}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {showFontFamily && (
              <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 min-w-[150px]">
                {fontFamilies.map((font) => (
                  <button
                    key={font.name}
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                    style={{ fontFamily: font.value || 'inherit' }}
                    onClick={() => handleFontFamily(font)}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size Dropdown */}
          <div className="relative">
            <button
              type="button"
              className={cn(toolbarButtonClass, "flex items-center gap-1 min-w-[60px] justify-between")}
              onClick={() => { setShowFontSize(!showFontSize); setShowFontFamily(false); }}
              disabled={disabled}
            >
              <span className="text-xs">{currentSize}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {showFontSize && (
              <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 min-w-[60px]">
                {fontSizes.map((size) => (
                  <button
                    key={size.name}
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                    onClick={() => handleFontSize(size)}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Text formatting */}
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
            onClick={() => execCommand('underline')}
            disabled={disabled}
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => execCommand('strikeThrough')}
            disabled={disabled}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Alignment */}
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => execCommand('justifyLeft')}
            disabled={disabled}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => execCommand('justifyCenter')}
            disabled={disabled}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => execCommand('justifyRight')}
            disabled={disabled}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => execCommand('justifyFull')}
            disabled={disabled}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Lists */}
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => execCommand('insertUnorderedList')}
            disabled={disabled}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => execCommand('insertOrderedList')}
            disabled={disabled}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Link */}
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={insertLink}
            disabled={disabled}
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable={!disabled && !readOnly}
        onInput={handleChange}
        onKeyDown={handleKeyDown}
        onClick={() => { setShowFontFamily(false); setShowFontSize(false); }}
        data-placeholder={placeholder}
        className={cn(
          "w-full bg-transparent p-4 focus:outline-none overflow-auto",
          sizeClasses[size],
          "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none"
        )}
        style={{ minHeight, maxHeight }}
      />
      
      {/* Footer */}
      <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          WYSIWYG Editor • HTML output
        </p>
        <button
          type="button"
          className="text-xs text-primary hover:underline"
          onClick={() => {
            if (editorRef.current) {
              const html = editorRef.current.innerHTML;
              navigator.clipboard.writeText(html);
            }
          }}
        >
          Copy HTML
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
