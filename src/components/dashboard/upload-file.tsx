'use client';

import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, File, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadFileProps {
  children?: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFileSelect?: (files: File[]) => void;
}

export function UploadFile({
  children,
  accept,
  multiple = false,
  className,
  onFileSelect
}: UploadFileProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);
    onFileSelect?.(newFiles);
  }, [onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleClick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className={cn('relative', className)}>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleClick}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        style={{ display: 'none' }}
        id={`upload-${Math.random().toString(36).substring(7)}`}
      />
      
      <motion.label
        htmlFor={`upload-${Math.random().toString(36).substring(7)}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center w-full h-full rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer',
          isDragging
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20',
          className
        )}
      >
        {children || (
          <div className="text-center p-4">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-white">Drop files here or click to upload</p>
            {accept && (
              <p className="text-xs text-gray-500 mt-1">Accepted: {accept}</p>
            )}
          </div>
        )}
      </motion.label>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-2 space-y-1">
          {uploadedFiles.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 rounded hover:bg-white/10 transition-colors"
              >
                <X className="h-3 w-3 text-gray-400" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
