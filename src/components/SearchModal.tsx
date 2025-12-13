import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, FileText, ArrowRight, Code, Video, MessageSquare, Download, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchItem {
  id: string;
  label: string;
  category: string;
  path: string;
  icon?: React.ReactNode;
}

// All searchable items - includes ALL components from drawer
const searchItems: SearchItem[] = [
  // Getting Started
  { id: 'installation', label: 'Installation', category: 'Getting Started', path: '/docs#installation' },
  { id: 'theming', label: 'Theming', category: 'Getting Started', path: '/docs#theming' },
  { id: 'colorscheme', label: 'Color Scheme', category: 'Getting Started', path: '/docs#colorscheme' },
  // Hooks
  { id: 'usecolormode', label: 'useColorMode', category: 'Hooks', path: '/docs#usecolormode' },
  { id: 'usecolormodevalue', label: 'useColorModeValue', category: 'Hooks', path: '/docs#usecolormodevalue' },
  { id: 'usebreakpointvalue', label: 'useBreakpointValue', category: 'Hooks', path: '/docs#usebreakpointvalue' },
  { id: 'usethemetoken', label: 'useThemeToken', category: 'Hooks', path: '/docs#usethemetoken' },
  // Layout
  { id: 'box', label: 'Box', category: 'Layout', path: '/docs#box', icon: <Layout className="h-4 w-4" /> },
  { id: 'flex', label: 'Flex', category: 'Layout', path: '/docs#flex' },
  { id: 'stack', label: 'Stack', category: 'Layout', path: '/docs#stack' },
  { id: 'grid', label: 'Grid', category: 'Layout', path: '/docs#grid' },
  { id: 'container', label: 'Container', category: 'Layout', path: '/docs#container' },
  { id: 'divider', label: 'Divider', category: 'Layout', path: '/docs#divider' },
  { id: 'center', label: 'Center & Wrap', category: 'Layout', path: '/docs#center' },
  { id: 'splitter', label: 'Splitter', category: 'Layout', path: '/docs#splitter' },
  // Typography
  { id: 'heading', label: 'Heading', category: 'Typography', path: '/docs#heading' },
  { id: 'text', label: 'Text', category: 'Typography', path: '/docs#text' },
  { id: 'prose', label: 'Prose & Highlight', category: 'Typography', path: '/docs#prose' },
  // Forms
  { id: 'button', label: 'Button', category: 'Forms', path: '/docs#button' },
  { id: 'iconbutton', label: 'Icon Button', category: 'Forms', path: '/docs#iconbutton' },
  { id: 'input', label: 'Input', category: 'Forms', path: '/docs#input' },
  { id: 'passwordinput', label: 'Password Input', category: 'Forms', path: '/docs#passwordinput' },
  { id: 'textarea', label: 'Textarea', category: 'Forms', path: '/docs#textarea' },
  { id: 'select', label: 'Select', category: 'Forms', path: '/docs#select' },
  { id: 'checkbox', label: 'Checkbox', category: 'Forms', path: '/docs#checkbox' },
  { id: 'radio', label: 'Radio', category: 'Forms', path: '/docs#radio' },
  { id: 'switch', label: 'Switch', category: 'Forms', path: '/docs#switch' },
  { id: 'slider', label: 'Slider', category: 'Forms', path: '/docs#slider' },
  { id: 'pininput', label: 'Pin Input', category: 'Forms', path: '/docs#pininput' },
  { id: 'numberinput', label: 'Number Input', category: 'Forms', path: '/docs#numberinput' },
  { id: 'fileupload', label: 'File Upload', category: 'Forms', path: '/docs#fileupload' },
  { id: 'colorpicker', label: 'Color Picker', category: 'Forms', path: '/docs#colorpicker' },
  { id: 'datepicker', label: 'Date Picker', category: 'Forms', path: '/docs#datepicker' },
  { id: 'segmentedcontrol', label: 'Segmented Control', category: 'Forms', path: '/docs#segmentedcontrol' },
  { id: 'downloadtrigger', label: 'Download Trigger', category: 'Forms', path: '/docs#downloadtrigger', icon: <Download className="h-4 w-4" /> },
  // Data Display
  { id: 'avatar', label: 'Avatar', category: 'Data Display', path: '/docs#avatar' },
  { id: 'badge', label: 'Badge', category: 'Data Display', path: '/docs#badge' },
  { id: 'tag', label: 'Tag', category: 'Data Display', path: '/docs#tag' },
  { id: 'code', label: 'Code & Kbd', category: 'Data Display', path: '/docs#code' },
  { id: 'syntaxhighlighter', label: 'Syntax Highlighter', category: 'Data Display', path: '/docs#syntaxhighlighter' },
  { id: 'qrcode', label: 'QR Code', category: 'Data Display', path: '/docs#qrcode' },
  { id: 'stat', label: 'Stat', category: 'Data Display', path: '/docs#stat' },
  { id: 'table', label: 'Table', category: 'Data Display', path: '/docs#table' },
  { id: 'list', label: 'List', category: 'Data Display', path: '/docs#list' },
  { id: 'tooltip', label: 'Tooltip', category: 'Data Display', path: '/docs#tooltip' },
  { id: 'clipboard', label: 'Clipboard', category: 'Data Display', path: '/docs#clipboard' },
  { id: 'timeline', label: 'Timeline', category: 'Data Display', path: '/docs#timeline' },
  { id: 'carousel', label: 'Carousel', category: 'Data Display', path: '/docs#carousel' },
  { id: 'image', label: 'Image', category: 'Data Display', path: '/docs#image' },
  { id: 'pagination', label: 'Pagination', category: 'Data Display', path: '/docs#pagination' },
  { id: 'texteditor', label: 'Text Editor', category: 'Data Display', path: '/docs#texteditor' },
  { id: 'filetree', label: 'File Tree', category: 'Data Display', path: '/docs#filetree' },
  { id: 'aspectratio', label: 'Aspect Ratio', category: 'Data Display', path: '/docs#aspectratio' },
  // Feedback
  { id: 'alert', label: 'Alert', category: 'Feedback', path: '/docs#alert' },
  { id: 'toast', label: 'Toast', category: 'Feedback', path: '/docs#toast' },
  { id: 'progress', label: 'Progress', category: 'Feedback', path: '/docs#progress' },
  { id: 'skeleton', label: 'Skeleton', category: 'Feedback', path: '/docs#skeleton' },
  { id: 'spinner', label: 'Spinner', category: 'Feedback', path: '/docs#spinner' },
  { id: 'emptystate', label: 'Empty State', category: 'Feedback', path: '/docs#emptystate' },
  // Overlay
  { id: 'modal', label: 'Modal', category: 'Overlay', path: '/docs#modal' },
  { id: 'drawer', label: 'Drawer', category: 'Overlay', path: '/docs#drawer' },
  { id: 'menu', label: 'Menu', category: 'Overlay', path: '/docs#menu' },
  // Navigation
  { id: 'tabs', label: 'Tabs', category: 'Navigation', path: '/docs#tabs' },
  { id: 'accordion', label: 'Accordion', category: 'Navigation', path: '/docs#accordion' },
  { id: 'breadcrumb', label: 'Breadcrumb', category: 'Navigation', path: '/docs#breadcrumb' },
  { id: 'steps', label: 'Steps', category: 'Navigation', path: '/docs#steps' },
  // Advanced
  { id: 'codeeditor', label: 'Code Editor', category: 'Advanced', path: '/docs#codeeditor', icon: <Code className="h-4 w-4" /> },
  { id: 'webplayer', label: 'Web Player', category: 'Advanced', path: '/docs#webplayer' },
  { id: 'videocall', label: 'Video Call', category: 'Advanced', path: '/docs#videocall', icon: <Video className="h-4 w-4" /> },
  { id: 'chatroom', label: 'Chat Room', category: 'Advanced', path: '/docs#chatroom', icon: <MessageSquare className="h-4 w-4" /> },
  // Pages
  { id: 'playground', label: 'Playground', category: 'Pages', path: '/playground' },
  { id: 'docs', label: 'Documentation', category: 'Pages', path: '/docs' },
  { id: 'home', label: 'Home', category: 'Pages', path: '/' },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const filteredItems = useMemo(() => {
    if (!query.trim()) return searchItems.slice(0, 12);
    const lowerQuery = query.toLowerCase();
    return searchItems.filter(
      item => 
        item.label.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        item.id.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    onClose();
    if (item.path.includes('#')) {
      const [path, hash] = item.path.split('#');
      if (location.pathname === path || (path === '/docs' && location.pathname === '/docs')) {
        // Same page, just scroll
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(item.path);
      }
    } else {
      navigate(item.path);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search components, hooks, pages..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
            ESC
          </kbd>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                  index === selectedIndex 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                )}
              >
                {item.icon || <FileText className="h-4 w-4 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.label}</div>
                  <div className={cn(
                    'text-xs truncate',
                    index === selectedIndex ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}>
                    {item.category}
                  </div>
                </div>
                <ArrowRight className={cn(
                  'h-4 w-4 flex-shrink-0',
                  index === selectedIndex ? 'opacity-100' : 'opacity-0'
                )} />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded">↑↓</kbd> Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded">Enter</kbd> Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
