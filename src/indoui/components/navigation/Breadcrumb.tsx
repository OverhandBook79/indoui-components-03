import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  maxItems?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles: Record<string, { text: string; icon: string; gap: string }> = {
  sm: { text: 'text-xs', icon: 'w-3 h-3', gap: 'gap-1' },
  md: { text: 'text-sm', icon: 'w-4 h-4', gap: 'gap-2' },
  lg: { text: 'text-base', icon: 'w-5 h-5', gap: 'gap-3' },
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator,
  showHome = false,
  maxItems,
  size = 'md',
  className,
}) => {
  const sizeStyle = sizeStyles[size];
  
  let displayItems = items;
  let hasEllipsis = false;
  
  if (maxItems && items.length > maxItems) {
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));
    displayItems = [firstItem, ...lastItems];
    hasEllipsis = true;
  }

  const defaultSeparator = <ChevronRight className={cn('text-muted-foreground', sizeStyle.icon)} />;

  const renderItem = (item: BreadcrumbItem, isLast: boolean) => {
    const content = (
      <span className="flex items-center gap-1">
        {item.icon}
        {item.label}
      </span>
    );

    if (isLast || !item.href) {
      return (
        <span className={cn('text-foreground font-medium', sizeStyle.text)}>
          {content}
        </span>
      );
    }

    return (
      <a
        href={item.href}
        className={cn(
          'text-muted-foreground hover:text-foreground transition-colors',
          sizeStyle.text
        )}
      >
        {content}
      </a>
    );
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={cn('flex items-center flex-wrap', sizeStyle.gap)}>
        {showHome && (
          <>
            <li className="flex items-center">
              <a
                href="/"
                className={cn(
                  'text-muted-foreground hover:text-foreground transition-colors',
                  sizeStyle.text
                )}
              >
                <Home className={sizeStyle.icon} />
              </a>
            </li>
            {displayItems.length > 0 && (
              <li className="flex items-center" aria-hidden="true">
                {separator || defaultSeparator}
              </li>
            )}
          </>
        )}
        
        {displayItems.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === displayItems.length - 1;
          
          return (
            <React.Fragment key={index}>
              {hasEllipsis && isFirst && (
                <>
                  <li className="flex items-center">
                    {renderItem(item, false)}
                  </li>
                  <li className="flex items-center" aria-hidden="true">
                    {separator || defaultSeparator}
                  </li>
                  <li className={cn('text-muted-foreground', sizeStyle.text)}>...</li>
                  <li className="flex items-center" aria-hidden="true">
                    {separator || defaultSeparator}
                  </li>
                </>
              )}
              
              {(!hasEllipsis || !isFirst) && (
                <>
                  <li className="flex items-center">
                    {renderItem(item, isLast)}
                  </li>
                  {!isLast && (
                    <li className="flex items-center" aria-hidden="true">
                      {separator || defaultSeparator}
                    </li>
                  )}
                </>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';