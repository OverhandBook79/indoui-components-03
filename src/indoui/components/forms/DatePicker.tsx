import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { SizeKey } from '../../theme/tokens';

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  min?: Date;
  max?: Date;
  placeholder?: string;
  size?: SizeKey;
  disabled?: boolean;
  className?: string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const sizeClasses: Record<SizeKey, string> = {
  xs: 'h-7 text-xs px-2',
  sm: 'h-8 text-sm px-2.5',
  md: 'h-10 text-sm px-3',
  lg: 'h-11 text-base px-3.5',
  xl: 'h-12 text-lg px-4',
  '2xl': 'h-14 text-xl px-5',
};

type ViewMode = 'days' | 'months' | 'years';

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  defaultValue,
  onChange,
  min,
  max,
  placeholder = 'Select date',
  size = 'md',
  disabled = false,
  className,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value || defaultValue);
  const [viewDate, setViewDate] = useState(value || defaultValue || new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('days');
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate years range
  const currentYear = viewDate.getFullYear();
  const yearsStart = Math.floor(currentYear / 12) * 12;
  const years = Array.from({ length: 12 }, (_, i) => yearsStart + i);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedDate(value);
      setViewDate(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setViewMode('days');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    setViewDate(new Date(viewDate.getFullYear(), monthIndex, 1));
    setViewMode('days');
  };

  const handleYearSelect = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
    setViewMode('months');
  };

  const handlePrev = () => {
    if (viewMode === 'days') {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    } else if (viewMode === 'months') {
      setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
    } else {
      setViewDate(new Date(viewDate.getFullYear() - 12, viewDate.getMonth(), 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'days') {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    } else if (viewMode === 'months') {
      setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
    } else {
      setViewDate(new Date(viewDate.getFullYear() + 12, viewDate.getMonth(), 1));
    }
  };

  const isDateDisabled = (date: Date) => {
    if (min && date < min) return true;
    if (max && date > max) return true;
    return false;
  };

  const isSameDay = (a: Date, b: Date) => {
    return a.getDate() === b.getDate() &&
           a.getMonth() === b.getMonth() &&
           a.getFullYear() === b.getFullYear();
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const formatDate = (date: Date) => {
    return `${MONTHS[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const days = getDaysInMonth(viewDate);

  const getHeaderText = () => {
    if (viewMode === 'years') {
      return `${yearsStart} - ${yearsStart + 11}`;
    }
    if (viewMode === 'months') {
      return viewDate.getFullYear().toString();
    }
    return `${MONTHS[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 border border-input rounded-md bg-background',
          'hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring',
          sizeClasses[size],
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className={cn(!selectedDate && 'text-muted-foreground')}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[2px]"
            onClick={() => { setIsOpen(false); setViewMode('days'); }}
          />
          {/* Calendar popup */}
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] p-4 bg-popover border border-border rounded-xl shadow-2xl w-80 animate-in fade-in-0 zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (viewMode === 'days') setViewMode('months');
                  else if (viewMode === 'months') setViewMode('years');
                }}
                className="font-semibold text-foreground hover:bg-muted px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                {getHeaderText()}
                {viewMode !== 'years' && <ChevronDown className="h-3 w-3" />}
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Days View */}
            {viewMode === 'days' && (
              <>
                {/* Days of week */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="text-xs font-medium text-muted-foreground text-center py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    if (!day) {
                      return <div key={`empty-${index}`} />;
                    }

                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const dayDisabled = isDateDisabled(day);

                    return (
                      <button
                        key={day.getTime()}
                        type="button"
                        disabled={dayDisabled}
                        onClick={() => handleDateSelect(day)}
                        className={cn(
                          'h-9 w-9 text-sm rounded-lg transition-all font-medium',
                          'hover:bg-accent hover:text-accent-foreground',
                          isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md',
                          isToday(day) && !isSelected && 'border-2 border-primary text-primary',
                          dayDisabled && 'opacity-30 cursor-not-allowed hover:bg-transparent'
                        )}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Months View */}
            {viewMode === 'months' && (
              <div className="grid grid-cols-3 gap-2">
                {MONTHS_SHORT.map((month, index) => {
                  const isCurrentMonth = selectedDate && 
                    selectedDate.getMonth() === index && 
                    selectedDate.getFullYear() === viewDate.getFullYear();
                  
                  return (
                    <button
                      key={month}
                      type="button"
                      onClick={() => handleMonthSelect(index)}
                      className={cn(
                        'py-3 px-2 text-sm rounded-lg transition-all font-medium',
                        'hover:bg-accent hover:text-accent-foreground',
                        isCurrentMonth && 'bg-primary text-primary-foreground hover:bg-primary/90',
                        new Date().getMonth() === index && 
                        new Date().getFullYear() === viewDate.getFullYear() && 
                        !isCurrentMonth && 'border-2 border-primary text-primary'
                      )}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Years View */}
            {viewMode === 'years' && (
              <div className="grid grid-cols-3 gap-2">
                {years.map((year) => {
                  const isCurrentYear = selectedDate && selectedDate.getFullYear() === year;
                  
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearSelect(year)}
                      className={cn(
                        'py-3 px-2 text-sm rounded-lg transition-all font-medium',
                        'hover:bg-accent hover:text-accent-foreground',
                        isCurrentYear && 'bg-primary text-primary-foreground hover:bg-primary/90',
                        new Date().getFullYear() === year && !isCurrentYear && 'border-2 border-primary text-primary'
                      )}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Today button */}
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                setSelectedDate(today);
                setViewDate(today);
                onChange?.(today);
                setIsOpen(false);
              }}
              className="w-full mt-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors border border-primary/20"
            >
              Today
            </button>
          </div>
        </>
      )}
    </div>
  );
};
