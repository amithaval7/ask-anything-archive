
import { ArchiveLayout } from "@/components/layout/ArchiveLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileType, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const UploadText = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile && selectedFile.type === "text/plain") {
        setFile(selectedFile);
      } else {
        toast.error("Invalid file type. Please upload a text file (.txt).");
      }
    },
    accept: {
      'text/plain': ['.txt'],
    },
    maxFiles: 1
  });

  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploading(false);
        
        // Store file information
        localStorage.setItem('uploadedFileName', file.name);
        localStorage.setItem('uploadedFileType', file.type);
        
        toast.success(`File "${file.name}" uploaded successfully!`);
        
        // Navigate to the document view
        navigate(`/document/${encodeURIComponent(file.name)}`);
      }
    }, 300);
  };
  
  return (
    <ArchiveLayout>
      <div className="max-w-3xl mx-auto space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Upload Text File</h1>
          <p className="text-muted-foreground">
            Upload a text file to analyze and ask questions about its content
          </p>
        </div>
        
        <Card {...getRootProps()} className={`border-2 border-dashed p-10 text-center cursor-pointer ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-6">
              <FileType className={`h-12 w-12 ${isDragActive ? 'text-primary' : 'text-gray-500'}`} />
            </div>
            <div>
              <p className="font-medium text-lg">Drop your text file here, or click to select</p>
              <p className="text-sm text-muted-foreground mt-2">
                Supports .txt files up to 25MB
              </p>
            </div>
          </div>
        </Card>

        {file && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Selected File</CardTitle>
              <CardDescription>Ready to upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <FileType className="h-10 w-10 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              
              {uploading && <Progress value={progress} className="mt-4" />}
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" /> 
                  {uploading ? 'Uploading...' : 'Upload Text File'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ArchiveLayout>
  );
};

export default UploadText;
