import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X, Loader2 } from 'lucide-react';
import { RadiusKey } from '../../theme/tokens';
import { LayoutProps, getLayoutClasses } from '../../utils/layoutProps';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, LayoutProps {
  status?: 'info' | 'success' | 'warning' | 'error' | 'loading';
  variant?: 'subtle' | 'solid' | 'left-accent' | 'top-accent';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  isClosable?: boolean;
  onClose?: () => void;
  borderRadius?: RadiusKey;
  timeout?: number;
}

const statusStyles = {
  info: {
    subtle: 'bg-primary/10 text-primary border-primary/20',
    solid: 'bg-primary text-primary-foreground',
    'left-accent': 'bg-primary/5 text-primary border-l-4 border-primary',
    'top-accent': 'bg-primary/5 text-primary border-t-4 border-primary',
  },
  success: {
    subtle: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    solid: 'bg-green-600 text-white',
    'left-accent': 'bg-green-500/5 text-green-700 dark:text-green-400 border-l-4 border-green-500',
    'top-accent': 'bg-green-500/5 text-green-700 dark:text-green-400 border-t-4 border-green-500',
  },
  warning: {
    subtle: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    solid: 'bg-yellow-500 text-white',
    'left-accent': 'bg-yellow-500/5 text-yellow-700 dark:text-yellow-400 border-l-4 border-yellow-500',
    'top-accent': 'bg-yellow-500/5 text-yellow-700 dark:text-yellow-400 border-t-4 border-yellow-500',
  },
  error: {
    subtle: 'bg-destructive/10 text-destructive border-destructive/20',
    solid: 'bg-destructive text-destructive-foreground',
    'left-accent': 'bg-destructive/5 text-destructive border-l-4 border-destructive',
    'top-accent': 'bg-destructive/5 text-destructive border-t-4 border-destructive',
  },
  loading: {
    subtle: 'bg-muted text-muted-foreground border-border',
    solid: 'bg-muted text-foreground',
    'left-accent': 'bg-muted text-muted-foreground border-l-4 border-border',
    'top-accent': 'bg-muted text-muted-foreground border-t-4 border-border',
  },
};

const statusIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  loading: Loader2,
};

const radiusStyles: Record<RadiusKey, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-3xl',
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      status = 'info',
      variant = 'subtle',
      title,
      description,
      icon,
      isClosable,
      onClose,
      borderRadius = 'md',
      timeout,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(true);
    const Icon = statusIcons[status];
    const layoutClasses = getLayoutClasses(props as LayoutProps);

    useEffect(() => {
      if (timeout && timeout > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, timeout);
        return () => clearTimeout(timer);
      }
    }, [timeout, onClose]);

    const handleClose = () => {
      setIsVisible(false);
      onClose?.();
    };

    if (!isVisible) return null;

    const classes = cn(
      'flex items-start gap-3 p-4 border transition-all duration-200 animate-fade-in',
      statusStyles[status][variant],
      (variant === 'left-accent' || variant === 'top-accent') ? 'rounded-none' : radiusStyles[borderRadius],
      layoutClasses,
      className
    );

    return (
      <div ref={ref} role="alert" className={classes} {...props}>
        <div className={cn("flex-shrink-0 mt-0.5", status === 'loading' && 'animate-spin')}>
          {icon || <Icon className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          {title && <div className="font-medium">{title}</div>}
          {description && <div className="text-sm opacity-90 mt-1">{description}</div>}
          {children}
        </div>
        {isClosable && status !== 'loading' && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

// Promise-based Alert helper
interface PromiseAlertOptions<T> {
  loading: { title: string; description?: string };
  success: { title: string; description?: string } | ((data: T) => { title: string; description?: string });
  error: { title: string; description?: string } | ((err: Error) => { title: string; description?: string });
}

export function usePromiseAlert() {
  const [alertState, setAlertState] = useState<{
    status: 'info' | 'success' | 'warning' | 'error' | 'loading';
    title: string;
    description?: string;
    isVisible: boolean;
  } | null>(null);

  const promise = async <T,>(
    promiseFn: Promise<T>,
    options: PromiseAlertOptions<T>
  ): Promise<T> => {
    setAlertState({
      status: 'loading',
      title: options.loading.title,
      description: options.loading.description,
      isVisible: true,
    });

    try {
      const result = await promiseFn;
      const successResult = typeof options.success === 'function' 
        ? options.success(result) 
        : options.success;
      setAlertState({
        status: 'success',
        title: successResult.title,
        description: successResult.description,
        isVisible: true,
      });
      return result;
    } catch (err) {
      const errorResult = typeof options.error === 'function'
        ? options.error(err as Error)
        : options.error;
      setAlertState({
        status: 'error',
        title: errorResult.title,
        description: errorResult.description,
        isVisible: true,
      });
      throw err;
    }
  };

  const close = () => setAlertState(null);

  const AlertComponent = alertState?.isVisible ? (
    <Alert
      status={alertState.status}
      title={alertState.title}
      description={alertState.description}
      isClosable={alertState.status !== 'loading'}
      onClose={close}
    />
  ) : null;

  return { promise, AlertComponent, close, state: alertState };
}

Alert.displayName = 'Alert';
