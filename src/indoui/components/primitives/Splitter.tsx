import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { GripVertical, GripHorizontal } from 'lucide-react';

export interface SplitterProps {
  children: [React.ReactNode, React.ReactNode];
  orientation?: 'horizontal' | 'vertical';
  defaultSizes?: [number, number];
  minSize?: number;
  className?: string;
  w?: string;
  h?: string;
}

export const Splitter: React.FC<SplitterProps> = ({
  children,
  orientation = 'horizontal',
  defaultSizes = [50, 50],
  minSize = 10,
  className,
  w,
  h,
}) => {
  const [sizes, setSizes] = useState(defaultSizes);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    document.body.style.cursor = orientation === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let percentage: number;

      if (orientation === 'horizontal') {
        percentage = ((e.clientX - rect.left) / rect.width) * 100;
      } else {
        percentage = ((e.clientY - rect.top) / rect.height) * 100;
      }

      percentage = Math.max(minSize, Math.min(100 - minSize, percentage));
      setSizes([percentage, 100 - percentage]);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [orientation, minSize]);

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    isDragging.current = true;

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      let percentage: number;

      if (orientation === 'horizontal') {
        percentage = ((touch.clientX - rect.left) / rect.width) * 100;
      } else {
        percentage = ((touch.clientY - rect.top) / rect.height) * 100;
      }

      percentage = Math.max(minSize, Math.min(100 - minSize, percentage));
      setSizes([percentage, 100 - percentage]);
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, [orientation, minSize]);

  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex',
        isHorizontal ? 'flex-row' : 'flex-col',
        className
      )}
      style={{
        width: w,
        height: h,
      }}
    >
      {/* First panel */}
      <div
        className="overflow-auto"
        style={{
          [isHorizontal ? 'width' : 'height']: `${sizes[0]}%`,
          flexShrink: 0,
        }}
      >
        {children[0]}
      </div>

      {/* Divider */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={cn(
          'flex items-center justify-center bg-border hover:bg-primary/20 active:bg-primary/30 transition-colors flex-shrink-0 select-none',
          isHorizontal ? 'w-2 cursor-col-resize' : 'h-2 cursor-row-resize'
        )}
      >
        {isHorizontal ? (
          <GripVertical className="w-3 h-4 text-muted-foreground pointer-events-none" />
        ) : (
          <GripHorizontal className="w-4 h-3 text-muted-foreground pointer-events-none" />
        )}
      </div>

      {/* Second panel */}
      <div
        className="overflow-auto flex-1"
        style={{
          [isHorizontal ? 'width' : 'height']: `${sizes[1]}%`,
        }}
      >
        {children[1]}
      </div>
    </div>
  );
};

Splitter.displayName = 'Splitter';