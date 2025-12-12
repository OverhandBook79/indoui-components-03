import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { LayoutProps, getLayoutClasses } from '../../utils/layoutProps';
import { Play, RefreshCw, Maximize2, Minimize2, ExternalLink, Code, Eye, Terminal, X, AlertCircle } from 'lucide-react';

export interface WebPlayerProps extends LayoutProps {
  html?: string;
  css?: string;
  js?: string;
  srcDoc?: string;
  src?: string;
  title?: string;
  showToolbar?: boolean;
  showConsole?: boolean;
  consoleHeight?: number;
  autoRun?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}

interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
}

export const WebPlayer: React.FC<WebPlayerProps> = ({
  html = '',
  css = '',
  js = '',
  srcDoc,
  src,
  title = 'Preview',
  showToolbar = true,
  showConsole = false,
  consoleHeight = 150,
  autoRun = true,
  theme = 'dark',
  className,
  ...layoutProps
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(showConsole);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const layoutClasses = getLayoutClasses(layoutProps);
  
  // Generate srcDoc from html, css, js
  const generateSrcDoc = useCallback(() => {
    if (srcDoc) return srcDoc;
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    // Console proxy
    (function() {
      const originalConsole = { ...console };
      const postMessage = (type, args) => {
        window.parent.postMessage({
          type: 'console',
          method: type,
          message: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')
        }, '*');
      };
      
      console.log = (...args) => { postMessage('log', args); originalConsole.log(...args); };
      console.error = (...args) => { postMessage('error', args); originalConsole.error(...args); };
      console.warn = (...args) => { postMessage('warn', args); originalConsole.warn(...args); };
      console.info = (...args) => { postMessage('info', args); originalConsole.info(...args); };
      
      window.onerror = (msg, url, line, col, error) => {
        postMessage('error', [\`\${msg} at line \${line}:\${col}\`]);
      };
    })();
    
    try {
      ${js}
    } catch (e) {
      console.error(e.message);
    }
  </script>
</body>
</html>
    `.trim();
  }, [html, css, js, srcDoc]);
  
  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'console') {
        setConsoleMessages(prev => [...prev, {
          type: event.data.method,
          message: event.data.message,
          timestamp: new Date(),
        }]);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  // Auto-run on content change
  useEffect(() => {
    if (autoRun) {
      refresh();
    }
  }, [html, css, js, srcDoc, autoRun]);
  
  const refresh = () => {
    setIsLoading(true);
    setError(null);
    setConsoleMessages([]);
    
    if (iframeRef.current) {
      if (src) {
        iframeRef.current.src = src;
      } else {
        iframeRef.current.srcdoc = generateSrcDoc();
      }
    }
    
    setTimeout(() => setIsLoading(false), 500);
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const openInNewTab = () => {
    const blob = new Blob([generateSrcDoc()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };
  
  const clearConsole = () => {
    setConsoleMessages([]);
  };
  
  const getConsoleTypeColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
    }
  };
  
  const containerClasses = cn(
    'flex flex-col rounded-lg overflow-hidden border border-border',
    theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white',
    isFullscreen && 'fixed inset-4 z-50',
    layoutClasses,
    className
  );
  
  return (
    <>
      {/* Fullscreen backdrop */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleFullscreen}
        />
      )}
      
      <div className={containerClasses} style={{ minHeight: '300px' }}>
        {/* Toolbar */}
        {showToolbar && (
          <div className={cn(
            'flex items-center justify-between px-4 py-2 border-b',
            theme === 'dark' ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-gray-100 border-gray-200'
          )}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className={cn(
                'text-xs font-medium ml-3',
                theme === 'dark' ? 'text-[#8b8b8b]' : 'text-gray-500'
              )}>
                {title}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={refresh}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  theme === 'dark' ? 'hover:bg-[#3c3c3c] text-[#8b8b8b]' : 'hover:bg-gray-200 text-gray-500'
                )}
                title="Refresh"
              >
                <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
              </button>
              <button
                onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  isConsoleOpen && (theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-gray-200'),
                  theme === 'dark' ? 'hover:bg-[#3c3c3c] text-[#8b8b8b]' : 'hover:bg-gray-200 text-gray-500'
                )}
                title="Console"
              >
                <Terminal className="w-4 h-4" />
                {consoleMessages.some(m => m.type === 'error') && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <button
                onClick={openInNewTab}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  theme === 'dark' ? 'hover:bg-[#3c3c3c] text-[#8b8b8b]' : 'hover:bg-gray-200 text-gray-500'
                )}
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={toggleFullscreen}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  theme === 'dark' ? 'hover:bg-[#3c3c3c] text-[#8b8b8b]' : 'hover:bg-gray-200 text-gray-500'
                )}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
        
        {/* Preview iframe */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className={cn(
              'absolute inset-0 flex items-center justify-center z-10',
              theme === 'dark' ? 'bg-[#1e1e1e]/80' : 'bg-white/80'
            )}>
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-red-500/10">
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            title={title}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            srcDoc={src ? undefined : generateSrcDoc()}
            src={src}
            onLoad={() => setIsLoading(false)}
            onError={() => setError('Failed to load content')}
          />
        </div>
        
        {/* Console panel */}
        {isConsoleOpen && (
          <div 
            className={cn(
              'border-t flex flex-col',
              theme === 'dark' ? 'bg-[#1e1e1e] border-[#3c3c3c]' : 'bg-gray-50 border-gray-200'
            )}
            style={{ height: consoleHeight }}
          >
            <div className={cn(
              'flex items-center justify-between px-3 py-1.5 border-b',
              theme === 'dark' ? 'border-[#3c3c3c]' : 'border-gray-200'
            )}>
              <span className={cn(
                'text-xs font-medium',
                theme === 'dark' ? 'text-[#8b8b8b]' : 'text-gray-500'
              )}>
                Console
                {consoleMessages.length > 0 && (
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                    {consoleMessages.length}
                  </span>
                )}
              </span>
              <button
                onClick={clearConsole}
                className={cn(
                  'text-xs px-2 py-0.5 rounded transition-colors',
                  theme === 'dark' ? 'hover:bg-[#3c3c3c] text-[#8b8b8b]' : 'hover:bg-gray-200 text-gray-500'
                )}
              >
                Clear
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-2 font-mono text-xs">
              {consoleMessages.length === 0 ? (
                <span className={theme === 'dark' ? 'text-[#6b6b6b]' : 'text-gray-400'}>
                  Console output will appear here...
                </span>
              ) : (
                consoleMessages.map((msg, i) => (
                  <div key={i} className={cn('py-0.5 flex items-start gap-2', getConsoleTypeColor(msg.type))}>
                    <span className="opacity-50 select-none">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                    <span className="whitespace-pre-wrap break-all">{msg.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

WebPlayer.displayName = 'WebPlayer';
