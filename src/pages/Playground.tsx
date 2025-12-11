import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Copy, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as IndoUI from '@/indoui';
import { SyntaxHighlighter } from '@/indoui/components/data-display/SyntaxHighlighter';

const defaultCode = `// Try editing this code! Press Ctrl+R to run
// All IndoUI components are available

<IndoUI.Stack spacing={4}>
  <IndoUI.Heading size="xl">Hello IndoUI!</IndoUI.Heading>
  
  <IndoUI.Text color="muted">
    This is a live playground. Edit the code and see changes instantly.
  </IndoUI.Text>
  
  <IndoUI.Flex gap={3}>
    <IndoUI.Button colorScheme="primary">Primary</IndoUI.Button>
    <IndoUI.Button colorScheme="success">Success</IndoUI.Button>
    <IndoUI.Button variant="outline">Outline</IndoUI.Button>
  </IndoUI.Flex>
  
  <IndoUI.Progress value={70} hasStripe isAnimated />
  
  <IndoUI.Badge colorScheme="primary">Badge</IndoUI.Badge>
</IndoUI.Stack>
`;

const Playground: React.FC = () => {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState<React.ReactNode>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const executeCode = useCallback(() => {
    try {
      setError(null);
      
      // Extract JSX from code (remove comments and clean up)
      let jsxCode = code
        .split('\n')
        .filter(line => !line.trim().startsWith('//'))
        .join('\n')
        .trim();
      
      // Create a function that returns the JSX
      // We need to transform JSX to createElement calls
      const transformJSX = (jsx: string): React.ReactNode => {
        // Simple regex-based JSX parser for common patterns
        // This is a simplified version - real apps would use Babel
        
        try {
          // Parse the JSX string and create React elements
          const result = parseJSX(jsx);
          return result;
        } catch (e) {
          throw new Error(`JSX Parse Error: ${e}`);
        }
      };

      const result = transformJSX(jsxCode);
      setOutput(result);
    } catch (e: any) {
      setError(e.message || 'An error occurred');
      setOutput(null);
    }
  }, [code]);

  // Simple JSX parser
  const parseJSX = (jsx: string): React.ReactNode => {
    jsx = jsx.trim();
    
    if (!jsx) return null;
    
    // Handle text content
    if (!jsx.startsWith('<')) {
      return jsx;
    }

    // Parse opening tag
    const tagMatch = jsx.match(/^<([\w.]+)([^>]*?)(\/>|>)/);
    if (!tagMatch) {
      throw new Error('Invalid JSX syntax');
    }

    const [fullMatch, tagName, propsString, closing] = tagMatch;
    const isSelfClosing = closing === '/>';

    // Get component from IndoUI
    const getComponent = (name: string): any => {
      if (name.startsWith('IndoUI.')) {
        const componentName = name.replace('IndoUI.', '');
        return (IndoUI as any)[componentName];
      }
      // Basic HTML elements
      return name.toLowerCase();
    };

    const Component = getComponent(tagName);
    if (!Component && tagName.startsWith('IndoUI.')) {
      throw new Error(`Component ${tagName} not found`);
    }

    // Parse props
    const props: Record<string, any> = {};
    const propsRegex = /(\w+)=(?:{([^}]+)}|"([^"]*)")/g;
    let propMatch;
    while ((propMatch = propsRegex.exec(propsString)) !== null) {
      const [, propName, jsValue, stringValue] = propMatch;
      if (jsValue !== undefined) {
        // Evaluate JS value
        try {
          // Handle simple values
          if (jsValue === 'true') props[propName] = true;
          else if (jsValue === 'false') props[propName] = false;
          else if (!isNaN(Number(jsValue))) props[propName] = Number(jsValue);
          else props[propName] = jsValue;
        } catch {
          props[propName] = jsValue;
        }
      } else if (stringValue !== undefined) {
        props[propName] = stringValue;
      }
    }

    if (isSelfClosing) {
      return React.createElement(Component, props);
    }

    // Find children
    const afterOpenTag = jsx.slice(fullMatch.length);
    const closeTag = `</${tagName}>`;
    const closeIndex = findClosingTag(afterOpenTag, tagName);
    
    if (closeIndex === -1) {
      throw new Error(`Missing closing tag for ${tagName}`);
    }

    const childrenString = afterOpenTag.slice(0, closeIndex).trim();
    
    // Parse children
    const children = parseChildren(childrenString);
    
    return React.createElement(Component, props, ...children);
  };

  const findClosingTag = (jsx: string, tagName: string): number => {
    let depth = 1;
    let i = 0;
    const openRegex = new RegExp(`<${tagName.replace('.', '\\.')}[^>]*(?<!/)>`, 'g');
    const closeRegex = new RegExp(`</${tagName.replace('.', '\\.')}>`, 'g');
    
    while (depth > 0 && i < jsx.length) {
      const nextOpen = jsx.slice(i).search(openRegex);
      const nextClose = jsx.slice(i).search(closeRegex);
      
      if (nextClose === -1) return -1;
      
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        i += nextOpen + 1;
      } else {
        depth--;
        if (depth === 0) {
          return i + nextClose;
        }
        i += nextClose + 1;
      }
    }
    
    return -1;
  };

  const parseChildren = (childrenString: string): React.ReactNode[] => {
    const children: React.ReactNode[] = [];
    let remaining = childrenString.trim();
    
    while (remaining) {
      remaining = remaining.trim();
      if (!remaining) break;
      
      if (remaining.startsWith('<')) {
        // Find the end of this element
        const tagMatch = remaining.match(/^<([\w.]+)/);
        if (!tagMatch) {
          // Text content
          const nextTag = remaining.indexOf('<');
          if (nextTag === -1) {
            children.push(remaining);
            break;
          }
          children.push(remaining.slice(0, nextTag));
          remaining = remaining.slice(nextTag);
          continue;
        }
        
        const tagName = tagMatch[1];
        const isSelfClosing = remaining.match(new RegExp(`^<${tagName.replace('.', '\\.')}[^>]*/>`));
        
        if (isSelfClosing) {
          const endIndex = remaining.indexOf('/>') + 2;
          children.push(parseJSX(remaining.slice(0, endIndex)));
          remaining = remaining.slice(endIndex);
        } else {
          const closeTag = `</${tagName}>`;
          const openTagEnd = remaining.indexOf('>') + 1;
          const closeIndex = findClosingTag(remaining.slice(openTagEnd), tagName);
          
          if (closeIndex === -1) {
            throw new Error(`Missing closing tag for ${tagName}`);
          }
          
          const fullElement = remaining.slice(0, openTagEnd + closeIndex + closeTag.length);
          children.push(parseJSX(fullElement));
          remaining = remaining.slice(fullElement.length);
        }
      } else {
        // Text content
        const nextTag = remaining.indexOf('<');
        if (nextTag === -1) {
          children.push(remaining);
          break;
        }
        const text = remaining.slice(0, nextTag).trim();
        if (text) children.push(text);
        remaining = remaining.slice(nextTag);
      }
    }
    
    return children.filter(Boolean);
  };

  useEffect(() => {
    executeCode();
  }, []);

  // Keyboard shortcut: Ctrl+R to run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        executeCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeCode]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-xl font-bold text-foreground">IndoUI Playground</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={executeCode}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Play className="h-4 w-4" />
              Run
              <kbd className="ml-1 text-xs opacity-70">Ctrl+R</kbd>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Code Editor with Syntax Highlighting */}
        <div className="w-1/2 border-r border-border flex flex-col">
          <div className="p-3 border-b border-border bg-muted/30">
            <span className="text-sm font-medium text-muted-foreground">Code Editor</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <SyntaxHighlighter
              value={code}
              onChange={setCode}
              editable
              language="tsx"
              theme="dark"
              showLineNumbers
              showCopyButton={false}
              className="h-full rounded-none border-0"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="w-1/2 flex flex-col">
          <div className="p-3 border-b border-border bg-muted/30">
            <span className="text-sm font-medium text-muted-foreground">Preview</span>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            {error ? (
              <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Error</p>
                  <p className="text-sm text-destructive/80 mt-1">{error}</p>
                </div>
              </div>
            ) : (
              <div className="min-h-full">
                {output}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
