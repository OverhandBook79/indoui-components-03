import React from 'react';
import { cn } from '@/lib/utils';
import { Circle, CheckCircle } from 'lucide-react';
import { ColorScheme } from '../../theme/tokens';

export interface TimelineItem {
  title: string;
  description?: string;
  time?: string;
  icon?: React.ReactNode;
  status?: 'complete' | 'current' | 'pending';
}

export interface TimelineProps {
  items: TimelineItem[];
  variant?: 'solid' | 'outline';
  colorScheme?: ColorScheme;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles: Record<string, { dot: string; line: string; title: string; description: string; time: string }> = {
  sm: {
    dot: 'w-3 h-3',
    line: 'left-[5px] w-0.5',
    title: 'text-sm',
    description: 'text-xs',
    time: 'text-xs',
  },
  md: {
    dot: 'w-4 h-4',
    line: 'left-[7px] w-0.5',
    title: 'text-base',
    description: 'text-sm',
    time: 'text-sm',
  },
  lg: {
    dot: 'w-5 h-5',
    line: 'left-[9px] w-0.5',
    title: 'text-lg',
    description: 'text-base',
    time: 'text-base',
  },
};

const getStatusColor = (status: TimelineItem['status'], colorScheme: ColorScheme): string => {
  if (status === 'complete') return 'bg-green-500 border-green-500 text-white';
  if (status === 'current') {
    const colors: Partial<Record<ColorScheme, string>> = {
      primary: 'bg-primary border-primary text-primary-foreground',
      blue: 'bg-blue-500 border-blue-500 text-white',
      green: 'bg-green-500 border-green-500 text-white',
      purple: 'bg-purple-500 border-purple-500 text-white',
    };
    return colors[colorScheme] || colors.primary!;
  }
  return 'bg-muted border-muted-foreground/30 text-muted-foreground';
};

export const Timeline: React.FC<TimelineProps> = ({
  items,
  variant = 'solid',
  colorScheme = 'primary',
  size = 'md',
  className,
}) => {
  const sizeStyle = sizeStyles[size];

  return (
    <div className={cn('relative', className)}>
      {items.map((item, index) => (
        <div key={index} className="relative pb-8 last:pb-0">
          {/* Connecting line */}
          {index < items.length - 1 && (
            <div
              className={cn(
                'absolute top-4 h-full bg-border',
                sizeStyle.line
              )}
            />
          )}
          
          <div className="flex gap-4">
            {/* Dot/Icon */}
            <div
              className={cn(
                'relative z-10 flex items-center justify-center rounded-full border-2 flex-shrink-0',
                sizeStyle.dot,
                getStatusColor(item.status, colorScheme)
              )}
            >
              {item.icon || (item.status === 'complete' && <CheckCircle className="w-full h-full p-0.5" />)}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center justify-between gap-2">
                <h4 className={cn('font-medium text-foreground', sizeStyle.title)}>
                  {item.title}
                </h4>
                {item.time && (
                  <span className={cn('text-muted-foreground flex-shrink-0', sizeStyle.time)}>
                    {item.time}
                  </span>
                )}
              </div>
              {item.description && (
                <p className={cn('text-muted-foreground mt-1', sizeStyle.description)}>
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

Timeline.displayName = 'Timeline';