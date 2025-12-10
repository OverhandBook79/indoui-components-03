import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/lib/utils';
import { SizeKey } from '../../theme/tokens';

export interface QRCodeProps {
  value: string;
  size?: SizeKey | number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  bgColor?: string;
  fgColor?: string;
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
    x?: number;
    y?: number;
  };
  className?: string;
}

const sizeMap: Record<SizeKey, number> = {
  xs: 64,
  sm: 96,
  md: 128,
  lg: 192,
  xl: 256,
  '2xl': 320,
};

export const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 'md',
  level = 'L',
  includeMargin = true,
  bgColor = 'transparent',
  fgColor = 'currentColor',
  imageSettings,
  className,
}) => {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size];
  
  return (
    <div className={cn('inline-flex text-foreground', className)}>
      <QRCodeSVG
        value={value}
        size={pixelSize}
        level={level}
        includeMargin={includeMargin}
        bgColor={bgColor}
        fgColor={fgColor}
        imageSettings={imageSettings}
      />
    </div>
  );
};
