import React from 'react';
import { cn } from '@/lib/utils';
import { SizeKey } from '../../theme/tokens';

export interface TabsProps {
  children: React.ReactNode;
  defaultIndex?: number;
  index?: number;
  onChange?: (index: number) => void;
  variant?: 'line' | 'enclosed' | 'soft-rounded' | 'solid-rounded';
  size?: SizeKey;
  isFitted?: boolean;
  orientation?: 'horizontal' | 'vertical';
  colorScheme?: 'primary' | 'secondary' | 'neutral';
  className?: string;
}

interface TabsContextValue {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  variant: string;
  size: SizeKey;
  colorScheme: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabs = () => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('useTabs must be used within Tabs');
  return context;
};

export const Tabs: React.FC<TabsProps> = ({
  children,
  defaultIndex = 0,
  index,
  onChange,
  variant = 'line',
  size = 'md',
  isFitted,
  orientation = 'horizontal',
  colorScheme = 'primary',
  className,
}) => {
  const [activeIndex, setActiveIndex] = React.useState(index ?? defaultIndex);

  React.useEffect(() => {
    if (index !== undefined) {
      setActiveIndex(index);
    }
  }, [index]);

  const handleChange = (newIndex: number) => {
    if (index === undefined) {
      setActiveIndex(newIndex);
    }
    onChange?.(newIndex);
  };

  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex: handleChange, variant, size, colorScheme }}>
      <div className={cn(orientation === 'vertical' && 'flex gap-4', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabList: React.FC<TabListProps> = ({ children, className }) => {
  const { variant } = useTabs();

  const classes = cn(
    'flex',
    variant === 'line' && 'border-b border-border',
    variant === 'enclosed' && 'border-b border-border',
    variant === 'soft-rounded' && 'bg-muted p-1 rounded-lg',
    variant === 'solid-rounded' && 'gap-1',
    className
  );

  return (
    <div className={classes} role="tablist">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { index });
        }
        return child;
      })}
    </div>
  );
};

export interface TabProps {
  children: React.ReactNode;
  index?: number;
  isDisabled?: boolean;
  className?: string;
}

const sizeStyles: Record<SizeKey, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
  xl: 'px-6 py-3 text-lg',
  '2xl': 'px-8 py-4 text-xl',
};

export const Tab: React.FC<TabProps> = ({ children, index = 0, isDisabled, className }) => {
  const { activeIndex, setActiveIndex, variant, size, colorScheme } = useTabs();
  const isActive = activeIndex === index;

  const baseClasses = cn(
    'font-medium transition-all duration-200 cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    sizeStyles[size],
    isDisabled && 'opacity-50 cursor-not-allowed'
  );

  const variantClasses = cn(
    variant === 'line' && [
      'relative border-b-2 -mb-px',
      isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
    ],
    variant === 'enclosed' && [
      'border border-transparent rounded-t-md -mb-px',
      isActive ? 'border-border border-b-background bg-background' : 'text-muted-foreground hover:text-foreground',
    ],
    variant === 'soft-rounded' && [
      'rounded-md',
      isActive ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground',
    ],
    variant === 'solid-rounded' && [
      'rounded-full',
      isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted',
    ]
  );

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      onClick={() => !isDisabled && setActiveIndex(index)}
      className={cn(baseClasses, variantClasses, className)}
    >
      {children}
    </button>
  );
};

export interface TabPanelsProps {
  children: React.ReactNode;
  className?: string;
}

export const TabPanels: React.FC<TabPanelsProps> = ({ children, className }) => {
  const { activeIndex } = useTabs();

  return (
    <div className={cn('mt-4', className)}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && index === activeIndex) {
          return child;
        }
        return null;
      })}
    </div>
  );
};

export interface TabPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, className }) => {
  return (
    <div role="tabpanel" className={cn('animate-in fade-in-50 duration-200', className)}>
      {children}
    </div>
  );
};
