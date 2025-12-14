import React from 'react';
import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';

export interface DownloadTriggerProps {
  url: string;
  filename?: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const DownloadTrigger: React.FC<DownloadTriggerProps> = ({
  url,
  filename,
  children,
  className,
  disabled = false,
}) => {
  const handleDownload = async () => {
    if (disabled) return;
    
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || url.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Fallback to direct download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || '';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (children) {
    return (
      <span onClick={handleDownload} className={cn('cursor-pointer', disabled && 'cursor-not-allowed opacity-50', className)}>
        {children}
      </span>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-md',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      <Download className="w-4 h-4" />
      Download
    </button>
  );
};

DownloadTrigger.displayName = 'DownloadTrigger';