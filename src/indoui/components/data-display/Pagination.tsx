import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  className?: string;
}

const sizeStyles: Record<string, { button: string; icon: string }> = {
  sm: { button: 'h-7 min-w-7 text-xs', icon: 'w-3 h-3' },
  md: { button: 'h-9 min-w-9 text-sm', icon: 'w-4 h-4' },
  lg: { button: 'h-11 min-w-11 text-base', icon: 'w-5 h-5' },
};

const generatePageNumbers = (current: number, total: number, siblings: number): (number | 'ellipsis')[] => {
  const pages: (number | 'ellipsis')[] = [];
  const showLeftEllipsis = current - siblings > 2;
  const showRightEllipsis = current + siblings < total - 1;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    
    if (showLeftEllipsis) {
      pages.push('ellipsis');
    } else {
      for (let i = 2; i <= Math.min(3 + siblings, current - 1); i++) {
        pages.push(i);
      }
    }

    const start = Math.max(2, current - siblings);
    const end = Math.min(total - 1, current + siblings);
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (showRightEllipsis) {
      pages.push('ellipsis');
    } else {
      for (let i = Math.max(current + 1, total - 2 - siblings); i < total; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
    }

    if (!pages.includes(total)) pages.push(total);
  }

  return pages;
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  size = 'md',
  variant = 'outline',
  className,
}) => {
  const sizeStyle = sizeStyles[size];
  const pages = generatePageNumbers(currentPage, totalPages, siblingCount);

  const buttonBase = cn(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors',
    'disabled:opacity-50 disabled:pointer-events-none',
    sizeStyle.button
  );

  const getButtonStyles = (isActive: boolean) => {
    if (isActive) {
      return 'bg-primary text-primary-foreground';
    }
    switch (variant) {
      case 'solid':
        return 'bg-muted hover:bg-muted/80 text-foreground';
      case 'ghost':
        return 'hover:bg-muted text-foreground';
      default:
        return 'border border-input hover:bg-muted text-foreground';
    }
  };

  return (
    <nav className={cn('flex items-center gap-1', className)} aria-label="Pagination">
      {showFirstLast && (
        <button
          className={cn(buttonBase, getButtonStyles(false))}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="Go to first page"
        >
          <ChevronsLeft className={sizeStyle.icon} />
        </button>
      )}
      
      <button
        className={cn(buttonBase, getButtonStyles(false))}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className={sizeStyle.icon} />
      </button>

      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span key={`ellipsis-${index}`} className={cn('px-2 text-muted-foreground', sizeStyle.button)}>
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            className={cn(buttonBase, getButtonStyles(page === currentPage))}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        );
      })}

      <button
        className={cn(buttonBase, getButtonStyles(false))}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight className={sizeStyle.icon} />
      </button>

      {showFirstLast && (
        <button
          className={cn(buttonBase, getButtonStyles(false))}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
        >
          <ChevronsRight className={sizeStyle.icon} />
        </button>
      )}
    </nav>
  );
};

Pagination.displayName = 'Pagination';