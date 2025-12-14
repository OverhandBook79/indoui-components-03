import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { ColorScheme } from '../../theme/tokens';

export interface Step {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface StepsProps {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  colorScheme?: ColorScheme;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onChange?: (step: number) => void;
}

const sizeStyles: Record<string, { circle: string; icon: string; title: string; description: string }> = {
  sm: {
    circle: 'w-6 h-6 text-xs',
    icon: 'w-3 h-3',
    title: 'text-sm',
    description: 'text-xs',
  },
  md: {
    circle: 'w-8 h-8 text-sm',
    icon: 'w-4 h-4',
    title: 'text-base',
    description: 'text-sm',
  },
  lg: {
    circle: 'w-10 h-10 text-base',
    icon: 'w-5 h-5',
    title: 'text-lg',
    description: 'text-base',
  },
};

const getStepStatus = (index: number, currentStep: number): 'complete' | 'current' | 'pending' => {
  if (index < currentStep) return 'complete';
  if (index === currentStep) return 'current';
  return 'pending';
};

export const Steps: React.FC<StepsProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  colorScheme = 'primary',
  size = 'md',
  className,
  onChange,
}) => {
  const sizeStyle = sizeStyles[size];

  const getStatusStyles = (status: 'complete' | 'current' | 'pending') => {
    switch (status) {
      case 'complete':
        return 'bg-primary text-primary-foreground border-primary';
      case 'current':
        return 'bg-primary text-primary-foreground border-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-background';
      case 'pending':
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getLineStyles = (status: 'complete' | 'current' | 'pending') => {
    return status === 'complete' ? 'bg-primary' : 'bg-border';
  };

  if (orientation === 'vertical') {
    return (
      <div className={cn('flex flex-col', className)}>
        {steps.map((step, index) => {
          const status = getStepStatus(index, currentStep);
          
          return (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => onChange?.(index)}
                  disabled={!onChange}
                  className={cn(
                    'rounded-full border-2 flex items-center justify-center font-medium transition-all',
                    sizeStyle.circle,
                    getStatusStyles(status),
                    onChange && 'cursor-pointer hover:opacity-80'
                  )}
                >
                  {status === 'complete' ? (
                    <Check className={sizeStyle.icon} />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    index + 1
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div className={cn('w-0.5 h-12 mt-2', getLineStyles(status))} />
                )}
              </div>
              
              <div className="pb-8">
                <h4 className={cn('font-medium text-foreground', sizeStyle.title)}>
                  {step.title}
                </h4>
                {step.description && (
                  <p className={cn('text-muted-foreground', sizeStyle.description)}>
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => {
        const status = getStepStatus(index, currentStep);
        
        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => onChange?.(index)}
                disabled={!onChange}
                className={cn(
                  'rounded-full border-2 flex items-center justify-center font-medium transition-all',
                  sizeStyle.circle,
                  getStatusStyles(status),
                  onChange && 'cursor-pointer hover:opacity-80'
                )}
              >
                {status === 'complete' ? (
                  <Check className={sizeStyle.icon} />
                ) : step.icon ? (
                  step.icon
                ) : (
                  index + 1
                )}
              </button>
              <div className="text-center">
                <h4 className={cn('font-medium text-foreground', sizeStyle.title)}>
                  {step.title}
                </h4>
                {step.description && (
                  <p className={cn('text-muted-foreground', sizeStyle.description)}>
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={cn('flex-1 h-0.5 mx-4', getLineStyles(status))} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

Steps.displayName = 'Steps';