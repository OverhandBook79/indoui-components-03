import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SizeKey } from '../../theme/tokens';

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (color: string) => void;
  size?: SizeKey;
  disabled?: boolean;
  showInput?: boolean;
  presetColors?: string[];
  className?: string;
}

const defaultPresets = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280',
  '#000000', '#ffffff',
];

const sizeClasses: Record<SizeKey, { picker: string; swatch: string }> = {
  xs: { picker: 'w-6 h-6', swatch: 'w-4 h-4' },
  sm: { picker: 'w-8 h-8', swatch: 'w-5 h-5' },
  md: { picker: 'w-10 h-10', swatch: 'w-6 h-6' },
  lg: { picker: 'w-12 h-12', swatch: 'w-7 h-7' },
  xl: { picker: 'w-14 h-14', swatch: 'w-8 h-8' },
  '2xl': { picker: 'w-16 h-16', swatch: 'w-9 h-9' },
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  defaultValue = '#3b82f6',
  onChange,
  size = 'md',
  disabled = false,
  showInput = true,
  presetColors = defaultPresets,
  className,
}) => {
  const [color, setColor] = useState(value || defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setColor(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange?.(newColor);
  };

  const sizes = sizeClasses[size];

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'rounded-lg border-2 border-border shadow-sm transition-all',
          'hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          sizes.picker,
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        style={{ backgroundColor: color }}
      />

      {isOpen && (
        <div className="absolute z-[9999] mt-2 p-3 bg-popover border border-border rounded-xl shadow-2xl backdrop-blur-sm">
          {/* Native color input */}
          <input
            ref={inputRef}
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full h-32 cursor-pointer rounded border-0"
          />

          {/* Preset colors */}
          <div className="grid grid-cols-6 gap-1.5 mt-3">
            {presetColors.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleColorChange(preset)}
                className={cn(
                  'rounded-md border-2 transition-all hover:scale-110',
                  sizes.swatch,
                  color === preset ? 'border-primary' : 'border-transparent'
                )}
                style={{ backgroundColor: preset }}
              />
            ))}
          </div>

          {/* Hex input */}
          {showInput && (
            <div className="mt-3">
              <input
                type="text"
                value={color}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                    handleColorChange(val);
                  }
                }}
                className="w-full px-2 py-1 text-sm font-mono border border-border rounded bg-background text-foreground"
                placeholder="#000000"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
