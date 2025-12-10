import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

const placementStyles = {
  left: 'left-0 top-0 h-full',
  right: 'right-0 top-0 h-full',
  top: 'top-0 left-0 w-full',
  bottom: 'bottom-0 left-0 w-full',
};

const sizeStyles = {
  left: { xs: 'w-64', sm: 'w-80', md: 'w-96', lg: 'w-[32rem]', xl: 'w-[40rem]', full: 'w-full' },
  right: { xs: 'w-64', sm: 'w-80', md: 'w-96', lg: 'w-[32rem]', xl: 'w-[40rem]', full: 'w-full' },
  top: { xs: 'h-32', sm: 'h-48', md: 'h-64', lg: 'h-80', xl: 'h-96', full: 'h-full' },
  bottom: { xs: 'h-32', sm: 'h-48', md: 'h-64', lg: 'h-80', xl: 'h-96', full: 'h-full' },
};

const animationStyles = {
  left: 'animate-in slide-in-from-left duration-300',
  right: 'animate-in slide-in-from-right duration-300',
  top: 'animate-in slide-in-from-top duration-300',
  bottom: 'animate-in slide-in-from-bottom duration-300',
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  placement = 'right',
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
}) => {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div
        className={cn(
          'fixed bg-background shadow-xl',
          placementStyles[placement],
          sizeStyles[placement][size],
          animationStyles[placement]
        )}
      >
        {children}
      </div>
    </div>
  );
};

export const DrawerHeader: React.FC<{ children: React.ReactNode; className?: string; onClose?: () => void }> = ({
  children,
  className,
  onClose,
}) => (
  <div className={cn('flex items-center justify-between px-6 py-4 border-b border-border', className)}>
    <h2 className="text-lg font-semibold">{children}</h2>
    {onClose && (
      <button
        onClick={onClose}
        className="p-1 rounded-md hover:bg-muted transition-colors"
        aria-label="Close drawer"
      >
        <X className="h-5 w-5" />
      </button>
    )}
  </div>
);

export const DrawerBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('flex-1 overflow-y-auto px-6 py-4', className)}>{children}</div>
);

export const DrawerFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('flex items-center justify-end gap-3 px-6 py-4 border-t border-border', className)}>
    {children}
  </div>
);
