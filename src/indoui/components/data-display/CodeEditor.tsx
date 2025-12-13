import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { cn } from '@/lib/utils';
import { LayoutProps, getLayoutClasses } from '../../utils/layoutProps';
import { ChevronDown, X, Circle, Minus, Square, File, Folder, Search, Replace, ChevronUp, ChevronRight } from 'lucide-react';

export type CodeEditorLanguage =
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

export interface CodeEditorFile {
  name: string;
  language: CodeEditorLanguage;
  content: string;
}

export interface CodeEditorProps extends LayoutProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  language?: CodeEditorLanguage;
  filename?: string;
  files?: CodeEditorFile[];
  activeFile?: string;
  onFileChange?: (filename: string) => void;
  theme?: 'dark' | 'light';
  showLineNumbers?: boolean;
  showMinimap?: boolean;
  showToolbar?: boolean;
  readOnly?: boolean;
  className?: string;
  tabSize?: number;
  fontSize?: number;
}

const languageIcons: Record<string, string> = {
  javascript: '📜',
  typescript: '💠',
  jsx: '⚛️',
  tsx: '⚛️',
  css: '🎨',
  html: '🌐',
  json: '📋',
  python: '🐍',
  bash: '💻',
  shell: '💻',
  yaml: '📄',
  sql: '🗃️',
  graphql: '◇',
  markdown: '📝',
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  defaultValue = '',
  onChange,
  language = 'typescript',
  filename = 'untitled.tsx',
  files,
  activeFile,
  onFileChange,
  theme = 'dark',
  showLineNumbers = true,
  showMinimap = false,
  readOnly = false,
  className,
  tabSize = 2,
  fontSize = 13,
  ...layoutProps
}) => {
  const [code, setCode] = useState(value ?? defaultValue);
  const [currentFile, setCurrentFile] = useState(activeFile || filename);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  
  const prismTheme = theme === 'dark' ? themes.vsDark : themes.vsLight;
  const layoutClasses = getLayoutClasses(layoutProps);
  
  useEffect(() => {
    if (value !== undefined) {
      setCode(value);
    }
  }, [value]);
  
  useEffect(() => {
    if (activeFile) {
      setCurrentFile(activeFile);
    }
  }, [activeFile]);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCode(newValue);
    onChange?.(newValue);
    updateCursorPosition(e.target);
  }, [onChange]);
  
  const updateCursorPosition = (textarea: HTMLTextAreaElement) => {
    const text = textarea.value.substring(0, textarea.selectionStart);
    const lines = text.split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    });
  };
  
  const syncScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const spaces = ' '.repeat(tabSize);
      const newValue = code.substring(0, start) + spaces + code.substring(end);
      setCode(newValue);
      onChange?.(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + tabSize;
      }, 0);
    }
    
    // Auto-close brackets
    const brackets: Record<string, string> = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };
    if (brackets[e.key]) {
      e.preventDefault();
      const newValue = code.substring(0, start) + e.key + brackets[e.key] + code.substring(end);
      setCode(newValue);
      onChange?.(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    }
    
    // Enter with auto-indent
    if (e.key === 'Enter') {
      e.preventDefault();
      const textBefore = code.substring(0, start);
      const currentLine = textBefore.split('\n').pop() || '';
      const indent = currentLine.match(/^\s*/)?.[0] || '';
      const lastChar = textBefore.trim().slice(-1);
      const extraIndent = ['{', '(', '['].includes(lastChar) ? ' '.repeat(tabSize) : '';
      const newValue = code.substring(0, start) + '\n' + indent + extraIndent + code.substring(end);
      setCode(newValue);
      onChange?.(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length + extraIndent.length;
      }, 0);
    }
  }, [code, onChange, tabSize]);
  
  const handleFileClick = (file: CodeEditorFile) => {
    setCurrentFile(file.name);
    onFileChange?.(file.name);
  };
  
  const currentLanguage = files?.find(f => f.name === currentFile)?.language || language;
  const currentCode = files?.find(f => f.name === currentFile)?.content || code;
  
  return (
    <div
      className={cn(
        'flex flex-col rounded-lg overflow-hidden border border-border',
        theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-[#ffffff]',
        layoutClasses,
        className
      )}
      style={{ minHeight: '300px' }}
    >
      {/* Title bar */}
      <div className={cn(
        'flex items-center justify-between px-4 py-2 select-none',
        theme === 'dark' ? 'bg-[#323233]' : 'bg-[#e8e8e8]'
      )}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-90 transition cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-90 transition cursor-pointer" />
          </div>
        </div>
        <span className={cn(
          'text-xs font-medium',
          theme === 'dark' ? 'text-[#8b8b8b]' : 'text-[#6b6b6b]'
        )}>
          {currentFile}
        </span>
        <div className="w-16" />
      </div>
      
      {/* Tabs */}
      {files && files.length > 1 && (
        <div className={cn(
          'flex border-b overflow-x-auto',
          theme === 'dark' ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-[#f3f3f3] border-[#e7e7e7]'
        )}>
          {files.map((file) => (
            <button
              key={file.name}
              onClick={() => handleFileClick(file)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-xs font-medium transition-colors border-r',
                theme === 'dark' ? 'border-[#3c3c3c]' : 'border-[#e7e7e7]',
                currentFile === file.name
                  ? theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black'
                  : theme === 'dark' ? 'text-[#8b8b8b] hover:bg-[#2d2d2d]' : 'text-[#6b6b6b] hover:bg-[#e8e8e8]'
              )}
            >
              <span>{languageIcons[file.language] || '📄'}</span>
              {file.name}
              {currentFile === file.name && (
                <X className="w-3 h-3 ml-2 opacity-60 hover:opacity-100" />
              )}
            </button>
          ))}
        </div>
      )}
      
      {/* Editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Code area */}
        <div className="relative flex-1 overflow-hidden">
          <Highlight theme={prismTheme} code={currentCode} language={currentLanguage}>
            {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                ref={preRef}
                className={cn(
                  highlightClassName,
                  'overflow-auto h-full p-4 m-0 font-mono leading-6'
                )}
                style={{ 
                  ...style, 
                  margin: 0, 
                  background: 'transparent',
                  fontSize: `${fontSize}px`,
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                }}
              >
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line, key: i });
                  return (
                    <div key={i} {...lineProps} className={cn(lineProps.className, 'table-row')}>
                      {showLineNumbers && (
                        <span 
                          className={cn(
                            'table-cell pr-6 select-none text-right min-w-[3rem]',
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
          {!readOnly && (
            <textarea
              ref={textareaRef}
              value={currentCode}
              onChange={handleChange}
              onScroll={syncScroll}
              onKeyDown={handleKeyDown}
              onClick={(e) => updateCursorPosition(e.currentTarget)}
              onKeyUp={(e) => updateCursorPosition(e.currentTarget)}
              spellCheck={false}
              className={cn(
                'absolute inset-0 w-full h-full p-4 font-mono bg-transparent text-transparent resize-none outline-none',
                showLineNumbers && 'pl-16'
              )}
              style={{ 
                caretColor: theme === 'dark' ? '#fff' : '#000',
                fontSize: `${fontSize}px`,
                lineHeight: '1.5rem',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
              }}
            />
          )}
        </div>
        
        {/* Minimap */}
        {showMinimap && (
          <div className={cn(
            'w-24 border-l overflow-hidden',
            theme === 'dark' ? 'bg-[#1e1e1e] border-[#3c3c3c]' : 'bg-[#f9f9f9] border-[#e7e7e7]'
          )}>
            <div className="p-1 scale-[0.15] origin-top-left w-[600px]">
              <Highlight theme={prismTheme} code={currentCode} language={currentLanguage}>
                {({ tokens, getLineProps, getTokenProps }) => (
                  <pre className="font-mono text-[10px] leading-[2px]">
                    {tokens.slice(0, 200).map((line, i) => (
                      <div key={i} {...getLineProps({ line, key: i })}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token, key })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </div>
        )}
      </div>
      
      {/* Status bar */}
      <div className={cn(
        'flex items-center justify-between px-4 py-1 text-xs select-none',
        theme === 'dark' ? 'bg-[#007acc] text-white' : 'bg-[#007acc] text-white'
      )}>
        <div className="flex items-center gap-4">
          <span>{currentLanguage.toUpperCase()}</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
          <span>Spaces: {tabSize}</span>
        </div>
      </div>
    </div>
  );
};

CodeEditor.displayName = 'CodeEditor';
