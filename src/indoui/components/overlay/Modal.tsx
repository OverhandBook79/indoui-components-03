import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { SizeKey } from '../../theme/tokens';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  isCentered?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  motionPreset?: 'slideInBottom' | 'slideInRight' | 'scale' | 'none';
}

const sizeStyles = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full min-h-screen m-0 rounded-none',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  isCentered = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  motionPreset = 'scale',
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div
        className={cn(
          'fixed inset-0 overflow-y-auto',
          isCentered && 'flex items-center justify-center p-4'
        )}
      >
        <div
          className={cn(
            'relative w-full bg-background rounded-lg shadow-xl transition-all',
            sizeStyles[size],
            !isCentered && 'mx-auto my-10',
            motionPreset === 'scale' && 'animate-in zoom-in-95 fade-in duration-200',
            motionPreset === 'slideInBottom' && 'animate-in slide-in-from-bottom fade-in duration-200',
            motionPreset === 'slideInRight' && 'animate-in slide-in-from-right fade-in duration-200'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const ModalHeader: React.FC<{ children: React.ReactNode; className?: string; onClose?: () => void }> = ({
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
        aria-label="Close modal"
      >
        <X className="h-5 w-5" />
      </button>
    )}
  </div>
);

export const ModalBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('px-6 py-4', className)}>{children}</div>
);

export const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('flex items-center justify-end gap-3 px-6 py-4 border-t border-border', className)}>
    {children}
  </div>
);
