import React from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { SizeKey } from '../../theme/tokens';

export type ToastStatus = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  status?: ToastStatus;
  duration?: number;
  isClosable?: boolean;
  position?: ToastPosition;
  size?: 'sm' | 'md' | 'lg' | 'full';
  onClose?: () => void;
  className?: string;
}

const statusIcons: Record<ToastStatus, React.ReactNode> = {
  info: <Info className="w-5 h-5" />,
  success: <CheckCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
};

const statusStyles: Record<ToastStatus, string> = {
  info: 'bg-blue-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-red-600 text-white',
};

const sizeStyles: Record<string, string> = {
  sm: 'min-w-[200px] max-w-[300px]',
  md: 'min-w-[300px] max-w-[400px]',
  lg: 'min-w-[400px] max-w-[500px]',
  full: 'w-full max-w-full',
};

const positionStyles: Record<ToastPosition, string> = {
  'top': 'top-4 left-1/2 -translate-x-1/2',
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  status = 'info',
  isClosable = true,
  size = 'md',
  onClose,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg shadow-lg',
        statusStyles[status],
        sizeStyles[size],
        className
      )}
      role="alert"
    >
      <span className="flex-shrink-0">{statusIcons[status]}</span>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      {isClosable && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Toast Container for positioning
export interface ToastContainerProps {
  position?: ToastPosition;
  children: React.ReactNode;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  children,
}) => {
  return (
    <div className={cn('fixed z-[100] flex flex-col gap-2', positionStyles[position])}>
      {children}
    </div>
  );
};

Toast.displayName = 'Toast';
ToastContainer.displayName = 'ToastContainer';