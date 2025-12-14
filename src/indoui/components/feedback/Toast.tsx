import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';

export type ToastStatus = 'info' | 'success' | 'warning' | 'error' | 'loading';
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
  loading: <Loader2 className="w-5 h-5 animate-spin" />,
};

const statusStyles: Record<ToastStatus, string> = {
  info: 'bg-blue-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-red-600 text-white',
  loading: 'bg-muted text-foreground border border-border',
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
  duration = 5000,
  isClosable = true,
  size = 'md',
  onClose,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration && duration > 0 && status !== 'loading') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, status]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg shadow-lg animate-fade-in',
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
      {isClosable && status !== 'loading' && (
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
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
    <div className={cn('fixed z-[9999] flex flex-col gap-2', positionStyles[position])}>
      {children}
    </div>
  );
};

// Toast Manager for programmatic toasts
interface ToastItem {
  id: string;
  props: ToastProps;
}

type ToastManagerListener = (toasts: ToastItem[]) => void;

class ToastManagerClass {
  private toasts: ToastItem[] = [];
  private listeners: ToastManagerListener[] = [];
  private counter = 0;

  subscribe(listener: ToastManagerListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l([...this.toasts]));
  }

  show(props: Omit<ToastProps, 'id'>) {
    const id = `toast-${++this.counter}`;
    this.toasts.push({ id, props: { ...props, id } });
    this.notify();
    return id;
  }

  success(title: string, description?: string, duration?: number) {
    return this.show({ title, description, status: 'success', duration });
  }

  error(title: string, description?: string, duration?: number) {
    return this.show({ title, description, status: 'error', duration });
  }

  warning(title: string, description?: string, duration?: number) {
    return this.show({ title, description, status: 'warning', duration });
  }

  info(title: string, description?: string, duration?: number) {
    return this.show({ title, description, status: 'info', duration });
  }

  loading(title: string, description?: string) {
    return this.show({ title, description, status: 'loading', duration: 0, isClosable: false });
  }

  update(id: string, props: Partial<ToastProps>) {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      this.toasts[index] = { 
        ...this.toasts[index], 
        props: { ...this.toasts[index].props, ...props } 
      };
      this.notify();
    }
  }

  close(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  closeAll() {
    this.toasts = [];
    this.notify();
  }

  // Promise helper
  async promise<T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: Error) => string);
    }
  ): Promise<T> {
    const id = this.loading(options.loading);
    
    try {
      const result = await promise;
      this.update(id, {
        title: typeof options.success === 'function' ? options.success(result) : options.success,
        status: 'success',
        isClosable: true,
        duration: 5000,
      });
      setTimeout(() => this.close(id), 5000);
      return result;
    } catch (err) {
      const error = err as Error;
      this.update(id, {
        title: typeof options.error === 'function' ? options.error(error) : options.error,
        status: 'error',
        isClosable: true,
        duration: 5000,
      });
      setTimeout(() => this.close(id), 5000);
      throw error;
    }
  }
}

export const toastManager = new ToastManagerClass();

// Hook for using toast manager in components
export function useToastManager() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toastManager.subscribe(setToasts);
  }, []);

  return { toasts, toast: toastManager };
}

// Toaster component to render all toasts
export interface ToasterProps {
  position?: ToastPosition;
}

export const Toaster: React.FC<ToasterProps> = ({ position = 'top-right' }) => {
  const { toasts } = useToastManager();

  return (
    <ToastContainer position={position}>
      {toasts.map(({ id, props }) => (
        <Toast
          key={id}
          {...props}
          onClose={() => toastManager.close(id)}
        />
      ))}
    </ToastContainer>
  );
};

Toast.displayName = 'Toast';
ToastContainer.displayName = 'ToastContainer';
Toaster.displayName = 'Toaster';
