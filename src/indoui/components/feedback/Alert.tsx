import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { RadiusKey } from '../../theme/tokens';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'info' | 'success' | 'warning' | 'error';
  variant?: 'subtle' | 'solid' | 'left-accent' | 'top-accent';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  isClosable?: boolean;
  onClose?: () => void;
  borderRadius?: RadiusKey;
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
};

const statusIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
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
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const Icon = statusIcons[status];

    const handleClose = () => {
      setIsVisible(false);
      onClose?.();
    };

    if (!isVisible) return null;

    const classes = cn(
      'flex items-start gap-3 p-4 border transition-all duration-200',
      statusStyles[status][variant],
      (variant === 'left-accent' || variant === 'top-accent') ? 'rounded-none' : radiusStyles[borderRadius],
      className
    );

    return (
      <div ref={ref} role="alert" className={classes} {...props}>
        <div className="flex-shrink-0 mt-0.5">
          {icon || <Icon className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          {title && <div className="font-medium">{title}</div>}
          {description && <div className="text-sm opacity-90 mt-1">{description}</div>}
          {children}
        </div>
        {isClosable && (
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

Alert.displayName = 'Alert';
