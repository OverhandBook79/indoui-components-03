import React from 'react';
import { cn } from '@/lib/utils';
import { Inbox, Search, FileX, FolderOpen, Users, Image } from 'lucide-react';

export type EmptyStateType = 'default' | 'search' | 'file' | 'folder' | 'users' | 'image';

export interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const defaultIcons: Record<EmptyStateType, React.ReactNode> = {
  default: <Inbox className="w-full h-full" />,
  search: <Search className="w-full h-full" />,
  file: <FileX className="w-full h-full" />,
  folder: <FolderOpen className="w-full h-full" />,
  users: <Users className="w-full h-full" />,
  image: <Image className="w-full h-full" />,
};

const defaultTitles: Record<EmptyStateType, string> = {
  default: 'No data',
  search: 'No results found',
  file: 'No files',
  folder: 'Empty folder',
  users: 'No users',
  image: 'No images',
};

const defaultDescriptions: Record<EmptyStateType, string> = {
  default: 'There is no data to display at the moment.',
  search: 'Try adjusting your search or filter to find what you are looking for.',
  file: 'Upload files to get started.',
  folder: 'This folder is empty.',
  users: 'No users have been added yet.',
  image: 'No images to display.',
};

const sizeStyles: Record<string, { icon: string; title: string; description: string; container: string }> = {
  sm: {
    icon: 'w-12 h-12',
    title: 'text-lg',
    description: 'text-sm',
    container: 'py-8 px-4',
  },
  md: {
    icon: 'w-16 h-16',
    title: 'text-xl',
    description: 'text-base',
    container: 'py-12 px-6',
  },
  lg: {
    icon: 'w-20 h-20',
    title: 'text-2xl',
    description: 'text-lg',
    container: 'py-16 px-8',
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'default',
  title,
  description,
  icon,
  action,
  size = 'md',
  className,
}) => {
  const sizeStyle = sizeStyles[size];
  
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeStyle.container,
        className
      )}
    >
      <div className={cn('text-muted-foreground/50 mb-4', sizeStyle.icon)}>
        {icon || defaultIcons[type]}
      </div>
      
      <h3 className={cn('font-semibold text-foreground mb-2', sizeStyle.title)}>
        {title || defaultTitles[type]}
      </h3>
      
      <p className={cn('text-muted-foreground max-w-sm mb-4', sizeStyle.description)}>
        {description || defaultDescriptions[type]}
      </p>
      
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';