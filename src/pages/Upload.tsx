
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArchiveLayout } from "@/components/layout/ArchiveLayout";
import { FileUploader } from "@/components/upload/FileUploader";
import { YouTubeInput } from "@/components/upload/YouTubeInput";
import { Upload, Youtube } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiKeyInput } from "@/components/settings/ApiKeyInput";

const UploadPage = () => {
  const navigate = useNavigate();

  const handleFileUploaded = (file: File) => {
    // Store the file in localStorage (this is a simplification - in a real app you'd use a state management solution)
    localStorage.setItem('uploadedFileName', file.name);
    localStorage.setItem('uploadedFileType', file.type);
    // We can't store the actual file in localStorage, so we'd need a more robust solution in a real app
    
    // Navigate back to index with the file
    navigate('/');
  };

  const handleYoutubeIdSubmitted = (videoId: string) => {
    // Store the video ID in localStorage
    localStorage.setItem('youtubeVideoId', videoId);
    
    // Navigate back to index with the video ID
    navigate('/');
  };

  return (
    <ArchiveLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Add New Content</h1>
            <p className="text-muted-foreground">
              Upload documents or add YouTube links to ask questions about later
            </p>
          </div>
          <ApiKeyInput />
        </div>
        
        <Tabs defaultValue="files" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="files" className="flex gap-2">
              <Upload className="h-4 w-4" />
              <span>Upload Files</span>  
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex gap-2">
              <Youtube className="h-4 w-4" />
              <span>YouTube Link</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="files" className="py-6">
            <FileUploader onFileUploaded={handleFileUploaded} />
          </TabsContent>
          <TabsContent value="youtube" className="py-6">
            <YouTubeInput onVideoSubmitted={handleYoutubeIdSubmitted} />
          </TabsContent>
        </Tabs>
      </div>
    </ArchiveLayout>
  );
};

export default UploadPage;
