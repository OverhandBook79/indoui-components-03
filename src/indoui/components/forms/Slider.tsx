import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SizeKey, ColorScheme } from '../../theme/tokens';

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  size?: SizeKey;
  colorScheme?: ColorScheme;
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
}

const sizeClasses: Record<SizeKey, { track: string; thumb: string }> = {
  xs: { track: 'h-1', thumb: 'h-3 w-3' },
  sm: { track: 'h-1.5', thumb: 'h-4 w-4' },
  md: { track: 'h-2', thumb: 'h-5 w-5' },
  lg: { track: 'h-2.5', thumb: 'h-6 w-6' },
  xl: { track: 'h-3', thumb: 'h-7 w-7' },
  '2xl': { track: 'h-4', thumb: 'h-8 w-8' },
};

const getColorClass = (colorScheme: ColorScheme): { track: string; thumb: string } => {
  const colorMap: Record<string, { track: string; thumb: string }> = {
    primary: { track: 'bg-primary', thumb: 'border-primary' },
    secondary: { track: 'bg-secondary', thumb: 'border-secondary' },
    success: { track: 'bg-green-600', thumb: 'border-green-600' },
    warning: { track: 'bg-yellow-500', thumb: 'border-yellow-500' },
    danger: { track: 'bg-destructive', thumb: 'border-destructive' },
    blue: { track: 'bg-blue-600', thumb: 'border-blue-600' },
    red: { track: 'bg-red-600', thumb: 'border-red-600' },
    green: { track: 'bg-green-600', thumb: 'border-green-600' },
    yellow: { track: 'bg-yellow-500', thumb: 'border-yellow-500' },
    purple: { track: 'bg-purple-600', thumb: 'border-purple-600' },
    pink: { track: 'bg-pink-600', thumb: 'border-pink-600' },
    cyan: { track: 'bg-cyan-600', thumb: 'border-cyan-600' },
    teal: { track: 'bg-teal-600', thumb: 'border-teal-600' },
    orange: { track: 'bg-orange-600', thumb: 'border-orange-600' },
    lime: { track: 'bg-lime-600', thumb: 'border-lime-600' },
    rose: { track: 'bg-rose-600', thumb: 'border-rose-600' },
    gray: { track: 'bg-gray-600', thumb: 'border-gray-600' },
    neutral: { track: 'bg-neutral-600', thumb: 'border-neutral-600' },
  };
  return colorMap[colorScheme] || colorMap.primary;
};

export const Slider: React.FC<SliderProps> = ({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onChangeEnd,
  size = 'md',
  colorScheme = 'primary',
  showValue = false,
  disabled = false,
  className,
}) => {
  const [value, setValue] = useState(controlledValue ?? defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const getValueFromPosition = useCallback((clientX: number) => {
    if (!trackRef.current) return value;

    const rect = trackRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + percentage * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  }, [min, max, step, value]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    const newValue = getValueFromPosition(e.clientX);
    setValue(newValue);
    onChange?.(newValue);
  }, [disabled, getValueFromPosition, onChange]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newValue = getValueFromPosition(e.clientX);
      setValue(newValue);
      onChange?.(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onChangeEnd?.(value);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, getValueFromPosition, onChange, onChangeEnd, value]);

  const percentage = ((value - min) / (max - min)) * 100;
  const sizes = sizeClasses[size];
  const colors = getColorClass(colorScheme);

  return (
    <div className={cn('relative w-full', className)}>
      {showValue && (
        <div className="mb-2 text-sm text-foreground font-medium">
          {value}
        </div>
      )}
      <div
        ref={trackRef}
        className={cn(
          'relative w-full rounded-full cursor-pointer bg-muted',
          sizes.track,
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onMouseDown={handleMouseDown}
      >
        {/* Filled track */}
        <div
          className={cn('absolute left-0 top-0 h-full rounded-full', colors.track)}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Thumb */}
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full',
            'bg-background border-2 shadow-md',
            'hover:scale-110 transition-transform',
            isDragging && 'scale-110',
            sizes.thumb,
            colors.thumb
          )}
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export interface RangeSliderProps {
  value?: [number, number];
  defaultValue?: [number, number];
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: [number, number]) => void;
  size?: SizeKey;
  colorScheme?: ColorScheme;
  disabled?: boolean;
  className?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  value: controlledValue,
  defaultValue = [25, 75],
  min = 0,
  max = 100,
  step = 1,
  onChange,
  size = 'md',
  colorScheme = 'primary',
  disabled = false,
  className,
}) => {
  const [value, setValue] = useState<[number, number]>(controlledValue ?? defaultValue);
  const [activeThumb, setActiveThumb] = useState<0 | 1 | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const getValueFromPosition = useCallback((clientX: number) => {
    if (!trackRef.current) return 0;

    const rect = trackRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + percentage * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  }, [min, max, step]);

  const handleMouseDown = useCallback((e: React.MouseEvent, thumbIndex: 0 | 1) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setActiveThumb(thumbIndex);
  }, [disabled]);

  useEffect(() => {
    if (activeThumb === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newValue = getValueFromPosition(e.clientX);
      setValue(prev => {
        const updated: [number, number] = [...prev];
        if (activeThumb === 0) {
          updated[0] = Math.min(newValue, prev[1] - step);
        } else {
          updated[1] = Math.max(newValue, prev[0] + step);
        }
        onChange?.(updated);
        return updated;
      });
    };

    const handleMouseUp = () => {
      setActiveThumb(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeThumb, getValueFromPosition, onChange, step]);

  const percentage1 = ((value[0] - min) / (max - min)) * 100;
  const percentage2 = ((value[1] - min) / (max - min)) * 100;
  const sizes = sizeClasses[size];
  const colors = getColorClass(colorScheme);

  return (
    <div className={cn('relative w-full', className)}>
      <div
        ref={trackRef}
        className={cn(
          'relative w-full rounded-full cursor-pointer bg-muted',
          sizes.track,
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {/* Filled track */}
        <div
          className={cn('absolute top-0 h-full rounded-full', colors.track)}
          style={{
            left: `${percentage1}%`,
            width: `${percentage2 - percentage1}%`
          }}
        />
        
        {/* Thumbs */}
        {[0, 1].map((i) => (
          <div
            key={i}
            onMouseDown={(e) => handleMouseDown(e, i as 0 | 1)}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full',
              'bg-background border-2 shadow-md cursor-grab',
              'hover:scale-110 transition-transform',
              activeThumb === i && 'scale-110 cursor-grabbing',
              sizes.thumb,
              colors.thumb
            )}
            style={{ left: `${i === 0 ? percentage1 : percentage2}%` }}
          />
        ))}
      </div>
    </div>
  );
};
