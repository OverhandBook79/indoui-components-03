import React from 'react';
import { cn } from '@/lib/utils';
import { LayoutProps, getLayoutClasses } from '../../utils/layoutProps';

// Ratio is width/height, e.g., 16/9 = 1.777... for landscape, 9/16 = 0.5625 for portrait
export type AspectRatioValue = number;

export type RoundedValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface AspectRatioProps extends LayoutProps {
  /** Ratio as width/height. E.g., 16/9 for landscape, 9/16 for portrait, 1 for square */
  ratio?: AspectRatioValue;
  children: React.ReactNode;
  rounded?: RoundedValue;
  className?: string;
}

export interface AspectImageProps extends LayoutProps {
  src: string;
  alt: string;
  /** Ratio as width/height. E.g., 16/9 for landscape, 9/16 for portrait */
  ratio?: AspectRatioValue;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  fallbackSrc?: string;
  rounded?: RoundedValue;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
}

export interface AspectVideoProps extends LayoutProps {
  src: string;
  /** Ratio as width/height. E.g., 16/9 for landscape, 9/16 for portrait */
  ratio?: AspectRatioValue;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  poster?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  rounded?: RoundedValue;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  className?: string;
}

export interface AspectIframeProps extends LayoutProps {
  src: string;
  /** Ratio as width/height. E.g., 16/9 for landscape, 9/16 for portrait */
  ratio?: AspectRatioValue;
  title?: string;
  allow?: string;
  allowFullScreen?: boolean;
  sandbox?: string;
  loading?: 'lazy' | 'eager';
  rounded?: RoundedValue;
  className?: string;
}

const getRoundedClass = (rounded?: RoundedValue): string => {
  const roundedClasses: Record<RoundedValue, string> = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    'full': 'rounded-full',
  };
  return rounded ? roundedClasses[rounded] : '';
};

export const AspectRatio: React.FC<AspectRatioProps> = ({
  ratio = 16/9,
  children,
  rounded,
  className,
  ...layoutProps
}) => {
  const layoutClasses = getLayoutClasses(layoutProps);
  // ratio = width/height, so paddingBottom = (height/width) * 100% = (1/ratio) * 100%
  const paddingBottom = `${(1 / ratio) * 100}%`;
  const roundedClass = getRoundedClass(rounded);

  return (
    <div 
      className={cn('relative overflow-hidden', roundedClass, layoutClasses, className)}
      style={{ paddingBottom }}
    >
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
};

export const AspectImage: React.FC<AspectImageProps> = ({
  src,
  alt,
  ratio = 16/9,
  objectFit = 'cover',
  objectPosition = 'center',
  fallbackSrc,
  rounded,
  onLoad,
  onError,
  className,
  ...layoutProps
}) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const layoutClasses = getLayoutClasses(layoutProps);
  const paddingBottom = `${(1 / ratio) * 100}%`;
  const roundedClass = getRoundedClass(rounded);

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
    onError?.();
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div 
      className={cn('relative overflow-hidden bg-muted', roundedClass, layoutClasses, className)}
      style={{ paddingBottom }}
    >
      <img
        src={imgSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'absolute inset-0 w-full h-full transition-opacity duration-300',
          roundedClass,
          !isLoaded && 'opacity-0',
          isLoaded && 'opacity-100'
        )}
        style={{ 
          objectFit, 
          objectPosition 
        }}
        loading="lazy"
      />
      {!isLoaded && (
        <div className={cn('absolute inset-0 animate-pulse bg-muted', roundedClass)} />
      )}
    </div>
  );
};

export const AspectVideo: React.FC<AspectVideoProps> = ({
  src,
  ratio = 16/9,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  poster,
  objectFit = 'cover',
  rounded,
  onPlay,
  onPause,
  onEnded,
  className,
  ...layoutProps
}) => {
  const layoutClasses = getLayoutClasses(layoutProps);
  const paddingBottom = `${(1 / ratio) * 100}%`;
  const roundedClass = getRoundedClass(rounded);

  return (
    <div 
      className={cn('relative overflow-hidden bg-black', roundedClass, layoutClasses, className)}
      style={{ paddingBottom }}
    >
      <video
        src={src}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        poster={poster}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        className={cn('absolute inset-0 w-full h-full', roundedClass)}
        style={{ objectFit }}
      />
    </div>
  );
};

export const AspectIframe: React.FC<AspectIframeProps> = ({
  src,
  ratio = 16/9,
  title = 'Embedded content',
  allow,
  allowFullScreen = true,
  sandbox,
  loading = 'lazy',
  rounded,
  className,
  ...layoutProps
}) => {
  const layoutClasses = getLayoutClasses(layoutProps);
  const paddingBottom = `${(1 / ratio) * 100}%`;
  const roundedClass = getRoundedClass(rounded);

  return (
    <div 
      className={cn('relative overflow-hidden bg-muted', roundedClass, layoutClasses, className)}
      style={{ paddingBottom }}
    >
      <iframe
        src={src}
        title={title}
        allow={allow}
        allowFullScreen={allowFullScreen}
        sandbox={sandbox}
        loading={loading}
        className={cn('absolute inset-0 w-full h-full border-0', roundedClass)}
      />
    </div>
  );
};

AspectRatio.displayName = 'AspectRatio';
AspectImage.displayName = 'AspectImage';
AspectVideo.displayName = 'AspectVideo';
AspectIframe.displayName = 'AspectIframe';
