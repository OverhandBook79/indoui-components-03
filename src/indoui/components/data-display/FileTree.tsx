import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, FileCode, FileText, FileImage, FileJson } from 'lucide-react';

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  icon?: React.ReactNode;
}

export type FileTreeSize = 'sm' | 'md' | 'lg';

export interface FileTreeProps {
  data: FileNode[];
  size?: FileTreeSize;
  defaultExpanded?: boolean;
  onFileClick?: (file: FileNode, path: string) => void;
  onFolderClick?: (folder: FileNode, path: string, isExpanded: boolean) => void;
  selectedPath?: string;
  className?: string;
}

const sizeClasses: Record<FileTreeSize, { text: string; icon: string; padding: string }> = {
  sm: { text: 'text-xs', icon: 'h-3.5 w-3.5', padding: 'py-0.5 px-1' },
  md: { text: 'text-sm', icon: 'h-4 w-4', padding: 'py-1 px-2' },
  lg: { text: 'text-base', icon: 'h-5 w-5', padding: 'py-1.5 px-2' },
};

const getFileIcon = (fileName: string, iconSize: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
      return <FileCode className={cn(iconSize, "text-blue-500")} />;
    case 'json':
      return <FileJson className={cn(iconSize, "text-yellow-500")} />;
    case 'md':
    case 'txt':
      return <FileText className={cn(iconSize, "text-muted-foreground")} />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <FileImage className={cn(iconSize, "text-green-500")} />;
    case 'css':
    case 'scss':
      return <FileCode className={cn(iconSize, "text-pink-500")} />;
    default:
      return <File className={cn(iconSize, "text-muted-foreground")} />;
  }
};

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  size: FileTreeSize;
  defaultExpanded: boolean;
  onFileClick?: (file: FileNode, path: string) => void;
  onFolderClick?: (folder: FileNode, path: string, isExpanded: boolean) => void;
  selectedPath?: string;
  currentPath: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  depth,
  size,
  defaultExpanded,
  onFileClick,
  onFolderClick,
  selectedPath,
  currentPath,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const sizeStyles = sizeClasses[size];
  const nodePath = currentPath ? `${currentPath}/${node.name}` : node.name;
  const isSelected = selectedPath === nodePath;

  const handleClick = () => {
    if (node.type === 'folder') {
      const newExpanded = !isExpanded;
      setIsExpanded(newExpanded);
      onFolderClick?.(node, nodePath, newExpanded);
    } else {
      onFileClick?.(node, nodePath);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-1.5 w-full rounded hover:bg-muted/80 transition-colors",
          sizeStyles.padding,
          sizeStyles.text,
          isSelected && "bg-primary/10 text-primary"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {node.type === 'folder' ? (
          <>
            {isExpanded ? (
              <ChevronDown className={cn(sizeStyles.icon, "text-muted-foreground shrink-0")} />
            ) : (
              <ChevronRight className={cn(sizeStyles.icon, "text-muted-foreground shrink-0")} />
            )}
            {isExpanded ? (
              <FolderOpen className={cn(sizeStyles.icon, "text-yellow-500 shrink-0")} />
            ) : (
              <Folder className={cn(sizeStyles.icon, "text-yellow-500 shrink-0")} />
            )}
          </>
        ) : (
          <>
            <span className={cn(sizeStyles.icon, "shrink-0")} />
            {node.icon || getFileIcon(node.name, sizeStyles.icon)}
          </>
        )}
        <span className="truncate">{node.name}</span>
      </button>
      
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode
              key={`${nodePath}-${child.name}-${index}`}
              node={child}
              depth={depth + 1}
              size={size}
              defaultExpanded={defaultExpanded}
              onFileClick={onFileClick}
              onFolderClick={onFolderClick}
              selectedPath={selectedPath}
              currentPath={nodePath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({
  data,
  size = 'md',
  defaultExpanded = false,
  onFileClick,
  onFolderClick,
  selectedPath,
  className,
}) => {
  return (
    <div className={cn("border border-border rounded-lg bg-card overflow-hidden", className)}>
      <div className="p-2">
        {data.map((node, index) => (
          <TreeNode
            key={`${node.name}-${index}`}
            node={node}
            depth={0}
            size={size}
            defaultExpanded={defaultExpanded}
            onFileClick={onFileClick}
            onFolderClick={onFolderClick}
            selectedPath={selectedPath}
            currentPath=""
          />
        ))}
      </div>
    </div>
  );
};

export default FileTree;
