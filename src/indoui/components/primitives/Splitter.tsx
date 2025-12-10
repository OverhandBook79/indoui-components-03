import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { GripVertical, GripHorizontal } from 'lucide-react';

export interface SplitterProps {
  children: [React.ReactNode, React.ReactNode];
  orientation?: 'horizontal' | 'vertical';
  defaultSizes?: [number, number];
  minSize?: number;
  className?: string;
}

export const Splitter: React.FC<SplitterProps> = ({
  children,
  orientation = 'horizontal',
  defaultSizes = [50, 50],
  minSize = 10,
  className,
}) => {
  const [sizes, setSizes] = useState(defaultSizes);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;

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
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
        className={cn(
          'flex items-center justify-center bg-border hover:bg-primary/20 transition-colors cursor-col-resize flex-shrink-0',
          isHorizontal ? 'w-2 cursor-col-resize' : 'h-2 cursor-row-resize'
        )}
      >
        {isHorizontal ? (
          <GripVertical className="w-3 h-4 text-muted-foreground" />
        ) : (
          <GripHorizontal className="w-4 h-3 text-muted-foreground" />
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