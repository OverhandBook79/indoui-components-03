import React, { useCallback, useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload, X, File, Image, FileText } from 'lucide-react';
import { SizeKey, ColorScheme } from '../../theme/tokens';

export interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  accept?: Accept;
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  showPreview?: boolean;
  size?: SizeKey;
  colorScheme?: ColorScheme;
  className?: string;
  children?: React.ReactNode;
}

const sizeClasses: Record<SizeKey, string> = {
  xs: 'p-4 min-h-[80px]',
  sm: 'p-6 min-h-[100px]',
  md: 'p-8 min-h-[120px]',
  lg: 'p-10 min-h-[150px]',
  xl: 'p-12 min-h-[180px]',
  '2xl': 'p-14 min-h-[200px]',
};

const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) return Image;
  if (file.type.includes('pdf')) return FileText;
  return File;
};

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  accept,
  maxFiles = 10,
  maxSize = 10485760, // 10MB
  multiple = true,
  disabled = false,
  showPreview = true,
  size = 'md',
  colorScheme = 'primary',
  className,
  children,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = multiple ? [...files, ...acceptedFiles].slice(0, maxFiles) : acceptedFiles.slice(0, 1);
    setFiles(newFiles);
    onFilesChange?.(newFiles);

    // Generate previews for images
    const newPreviews = acceptedFiles
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        file,
        url: URL.createObjectURL(file),
      }));
    setPreviews(prev => [...prev, ...newPreviews]);
  }, [files, multiple, maxFiles, onFilesChange]);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange?.(newFiles);

    // Clean up preview URL
    const fileToRemove = files[index];
    const previewToRemove = previews.find(p => p.file === fileToRemove);
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.url);
      setPreviews(prev => prev.filter(p => p.file !== fileToRemove));
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles: multiple ? maxFiles : 1,
    maxSize,
    multiple,
    disabled,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-lg cursor-pointer transition-all',
          'flex flex-col items-center justify-center gap-2',
          sizeClasses[size],
          isDragActive && !isDragReject && 'border-primary bg-primary/5',
          isDragReject && 'border-destructive bg-destructive/5',
          !isDragActive && !isDragReject && 'border-border hover:border-primary/50 hover:bg-muted/50',
          disabled && 'opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent'
        )}
      >
        <input {...getInputProps()} />
        
        {children || (
          <>
            <Upload className={cn(
              'h-8 w-8',
              isDragActive ? 'text-primary' : 'text-muted-foreground'
            )} />
            <div className="text-center">
              <p className="font-medium text-foreground">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Max {maxFiles} files, up to {formatFileSize(maxSize)} each
            </p>
          </>
        )}
      </div>

      {showPreview && files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {files.map((file, index) => {
            const preview = previews.find(p => p.file === file);
            const FileIcon = getFileIcon(file);

            return (
              <div
                key={`${file.name}-${index}`}
                className="relative group rounded-lg border border-border bg-muted/30 p-2"
              >
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 z-10 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                
                {preview ? (
                  <img
                    src={preview.url}
                    alt={file.name}
                    className="w-full h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-20 flex items-center justify-center">
                    <FileIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                
                <p className="text-xs truncate mt-1 text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
