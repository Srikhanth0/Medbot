import React, { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  title: string;
  subtitle: string;
  acceptedTypes: string;
  onFileUpload: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  title,
  subtitle,
  acceptedTypes,
  onFileUpload
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    onFileUpload(files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-white">{subtitle}</p>
      </div>
      
      <div
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer
          ${isDragOver 
            ? 'border-primary bg-primary/10' 
            : 'border-muted-foreground bg-muted'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xl font-semibold text-blue-500">
              Drag and drop your File
            </p>
            <p className="text-blue-500">
              or click to browse
            </p>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Uploaded Files:</h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-card p-3 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <File className="w-5 h-5 text-primary" />
                <span className="text-card-foreground">{file.name}</span>
                <span className="text-white text-sm">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                className="text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload; 