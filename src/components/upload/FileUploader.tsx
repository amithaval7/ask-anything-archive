
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, FileText, FileImage } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const FileUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    }
  });

  const handleUpload = () => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    // Simulate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploading(false);
        // In a real app, you'd navigate to the content view or show success
      }
    }, 300);
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return <File className="h-8 w-8 text-red-500" />;
    if (file.type.includes('word') || file.type.includes('doc')) return <FileText className="h-8 w-8 text-blue-500" />;
    if (file.type.includes('text')) return <FileText className="h-8 w-8 text-gray-500" />;
    return <FileImage className="h-8 w-8 text-gray-500" />;
  };
  
  return (
    <div className="space-y-6">
      <Card {...getRootProps()} className={`border-2 border-dashed p-10 text-center cursor-pointer ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className={`h-12 w-12 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
          <div>
            <p className="font-medium text-lg">Drop your files here, or click to select</p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, Word documents (.doc, .docx), and text files
            </p>
          </div>
        </div>
      </Card>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Selected Files</h3>
          <Card className="p-4">
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-4">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              ))}
            </div>
            
            {uploading && <Progress value={progress} className="mt-4" />}
            
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleUpload} 
                disabled={files.length === 0 || uploading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" /> 
                {uploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
