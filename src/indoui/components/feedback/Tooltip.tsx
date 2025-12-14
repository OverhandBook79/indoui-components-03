import React from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface TooltipProps {
  children: React.ReactNode;
  label: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  hasArrow?: boolean;
  isDisabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  label,
  placement = 'top',
  hasArrow = true,
  isDisabled,
  openDelay = 200,
  closeDelay = 0,
}) => {
  if (isDisabled) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={openDelay}>
      <TooltipPrimitive>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={placement} className={cn(hasArrow && 'relative')}>
          {label}
        </TooltipContent>
      </TooltipPrimitive>
    </TooltipProvider>
  );
};
