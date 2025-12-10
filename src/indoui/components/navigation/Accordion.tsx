import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface AccordionProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  allowToggle?: boolean;
  defaultIndex?: number[];
  className?: string;
}

interface AccordionContextValue {
  openIndexes: number[];
  toggleIndex: (index: number) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

const useAccordion = () => {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error('useAccordion must be used within Accordion');
  return context;
};

export const Accordion: React.FC<AccordionProps> = ({
  children,
  allowMultiple = false,
  allowToggle = true,
  defaultIndex = [],
  className,
}) => {
  const [openIndexes, setOpenIndexes] = React.useState<number[]>(defaultIndex);

  const toggleIndex = (index: number) => {
    setOpenIndexes((prev) => {
      const isOpen = prev.includes(index);
      
      if (isOpen) {
        return allowToggle ? prev.filter((i) => i !== index) : prev;
      }
      
      if (allowMultiple) {
        return [...prev, index];
      }
      
      return [index];
    });
  };

  return (
    <AccordionContext.Provider value={{ openIndexes, toggleIndex }}>
      <div className={cn('divide-y divide-border border-y border-border', className)}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { index });
          }
          return child;
        })}
      </div>
    </AccordionContext.Provider>
  );
};

export interface AccordionItemProps {
  children: React.ReactNode;
  index?: number;
  isDisabled?: boolean;
  className?: string;
}

const AccordionItemContext = React.createContext<{ isOpen: boolean; isDisabled: boolean; index: number } | null>(null);

const useAccordionItem = () => {
  const context = React.useContext(AccordionItemContext);
  if (!context) throw new Error('useAccordionItem must be used within AccordionItem');
  return context;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({ children, index = 0, isDisabled = false, className }) => {
  const { openIndexes } = useAccordion();
  const isOpen = openIndexes.includes(index);

  return (
    <AccordionItemContext.Provider value={{ isOpen, isDisabled, index }}>
      <div className={cn(isDisabled && 'opacity-50', className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
};

export interface AccordionButtonProps {
  children: React.ReactNode;
  className?: string;
}

export const AccordionButton: React.FC<AccordionButtonProps> = ({ children, className }) => {
  const { toggleIndex } = useAccordion();
  const { isOpen, isDisabled, index } = useAccordionItem();

  return (
    <button
      type="button"
      onClick={() => !isDisabled && toggleIndex(index)}
      disabled={isDisabled}
      className={cn(
        'flex w-full items-center justify-between py-4 px-2 text-left font-medium transition-colors',
        'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
        isDisabled && 'cursor-not-allowed',
        className
      )}
      aria-expanded={isOpen}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  );
};

export interface AccordionPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const AccordionPanel: React.FC<AccordionPanelProps> = ({ children, className }) => {
  const { isOpen } = useAccordionItem();

  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-200',
        isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
      )}
    >
      <div className={cn('pb-4 px-2 text-muted-foreground', className)}>{children}</div>
    </div>
  );
};
