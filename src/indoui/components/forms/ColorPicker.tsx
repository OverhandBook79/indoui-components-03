import React, { useState, useRef, useEffect, useCallback } from 'react';
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

// Helper to convert HSL to Hex
const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Helper to convert Hex to HSL
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 100, l: 50 };
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
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
  const [hsl, setHsl] = useState(() => hexToHsl(value || defaultValue));
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setColor(value);
      setHsl(hexToHsl(value));
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
    setHsl(hexToHsl(newColor));
    onChange?.(newColor);
  };

  const handleGradientClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gradientRef.current) return;
    const rect = gradientRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    
    const s = Math.round(x * 100);
    const l = Math.round((1 - y) * 50 + (1 - x) * 50 * (1 - y));
    
    const newHsl = { ...hsl, s, l };
    setHsl(newHsl);
    const newColor = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    setColor(newColor);
    onChange?.(newColor);
  }, [hsl, onChange]);

  const handleHueClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const h = Math.round(x * 360);
    
    const newHsl = { ...hsl, h };
    setHsl(newHsl);
    const newColor = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    setColor(newColor);
    onChange?.(newColor);
  }, [hsl, onChange]);

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
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
          />
          {/* Color picker popup */}
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] p-4 bg-popover border border-border rounded-xl shadow-2xl animate-in fade-in-0 zoom-in-95 w-72">
            {/* Saturation/Lightness Gradient Box */}
            <div
              ref={gradientRef}
              className="relative w-full h-40 rounded-lg cursor-crosshair mb-3 border border-border"
              onClick={handleGradientClick}
              style={{
                background: `linear-gradient(to bottom, transparent, black), linear-gradient(to right, white, hsl(${hsl.h}, 100%, 50%))`,
              }}
            >
              {/* Picker indicator */}
              <div
                className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${hsl.s}%`,
                  top: `${100 - hsl.l}%`,
                  backgroundColor: color,
                }}
              />
            </div>

            {/* Hue Slider */}
            <div
              ref={hueRef}
              className="relative w-full h-4 rounded-full cursor-pointer mb-4"
              onClick={handleHueClick}
              style={{
                background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
              }}
            >
              {/* Hue indicator */}
              <div
                className="absolute top-1/2 w-4 h-4 border-2 border-white rounded-full shadow-md pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(hsl.h / 360) * 100}%`,
                  backgroundColor: `hsl(${hsl.h}, 100%, 50%)`,
                }}
              />
            </div>

            {/* Current color preview */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg border border-border shadow-inner"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Selected Color</div>
                <div className="font-mono text-sm text-foreground">{color.toUpperCase()}</div>
              </div>
            </div>

            {/* Preset colors */}
            <div className="grid grid-cols-6 gap-2 mb-3">
              {presetColors.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleColorChange(preset)}
                  className={cn(
                    'rounded-lg border-2 transition-all hover:scale-110 w-8 h-8',
                    color.toLowerCase() === preset.toLowerCase() ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'
                  )}
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>

            {/* Hex input */}
            {showInput && (
              <div>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                      handleColorChange(val);
                    } else if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                      setColor(val);
                    }
                  }}
                  onBlur={() => {
                    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
                      setColor(value || defaultValue);
                    }
                  }}
                  className="w-full px-3 py-2 text-sm font-mono border border-border rounded-lg bg-background text-foreground"
                  placeholder="#000000"
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
