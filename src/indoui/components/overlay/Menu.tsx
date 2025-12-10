import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Check } from 'lucide-react';

export interface MenuItemType {
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
  children?: MenuItemType[];
}

export interface MenuProps {
  items: MenuItemType[];
  trigger: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export interface ContextMenuProps {
  items: MenuItemType[];
  children: React.ReactNode;
  className?: string;
}

const MenuItem: React.FC<{ item: MenuItemType; onClose: () => void }> = ({ item, onClose }) => {
  const [showSubmenu, setShowSubmenu] = useState(false);

  if (item.children) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setShowSubmenu(true)}
        onMouseLeave={() => setShowSubmenu(false)}
      >
        <button
          className={cn(
            'w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md',
            'hover:bg-accent text-foreground',
            item.disabled && 'opacity-50 cursor-not-allowed'
          )}
          disabled={item.disabled}
        >
          <span className="flex items-center gap-2">
            {item.icon}
            {item.label}
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
        
        {showSubmenu && (
          <div className="absolute left-full top-0 ml-1 min-w-[160px] bg-popover border border-border rounded-lg shadow-lg p-1 z-50">
            {item.children.map((child, i) => (
              <MenuItem key={i} item={child} onClose={onClose} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      className={cn(
        'w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md',
        'hover:bg-accent',
        item.danger ? 'text-destructive hover:bg-destructive/10' : 'text-foreground',
        item.disabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={item.disabled}
      onClick={() => {
        item.onClick?.();
        onClose();
      }}
    >
      <span className="flex items-center gap-2">
        {item.icon}
        {item.label}
      </span>
      {item.shortcut && (
        <span className="text-xs text-muted-foreground">{item.shortcut}</span>
      )}
    </button>
  );
};

export const Menu: React.FC<MenuProps> = ({ items, trigger, align = 'start', className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative inline-block', className)} ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1 min-w-[180px] bg-popover border border-border rounded-lg shadow-lg p-1',
            align === 'start' && 'left-0',
            align === 'center' && 'left-1/2 -translate-x-1/2',
            align === 'end' && 'right-0'
          )}
        >
          {items.map((item, i) => (
            <MenuItem key={i} item={item} onClose={() => setIsOpen(false)} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ContextMenu: React.FC<ContextMenuProps> = ({ items, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  return (
    <div className={className} onContextMenu={handleContextMenu}>
      {children}
      
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-[100] min-w-[180px] bg-popover border border-border rounded-lg shadow-lg p-1"
          style={{ left: position.x, top: position.y }}
        >
          {items.map((item, i) => (
            <MenuItem key={i} item={item} onClose={() => setIsOpen(false)} />
          ))}
        </div>
      )}
    </div>
  );
};

export const MenuDivider: React.FC = () => (
  <div className="h-px bg-border my-1" />
);

Menu.displayName = 'Menu';
ContextMenu.displayName = 'ContextMenu';
MenuDivider.displayName = 'MenuDivider';