
import { ArchiveLayout } from "@/components/layout/ArchiveLayout";
import { ContentViewer } from "@/components/content/ContentViewer";
import { useState } from "react";
import { FileUploader } from "@/components/upload/FileUploader";
import { Card } from "@/components/ui/card";
import { ApiKeyInput } from "@/components/settings/ApiKeyInput";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
    setYoutubeVideoId(null); // Clear YouTube video if a file is uploaded
  };

  const handleYoutubeIdSubmitted = (videoId: string) => {
    setYoutubeVideoId(videoId);
    setUploadedFile(null); // Clear uploaded file if a YouTube video is added
  };

  return (
    <ArchiveLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {!uploadedFile && !youtubeVideoId ? (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Upload a Document</h1>
              <ApiKeyInput />
            </div>
            <p className="text-muted-foreground mb-4">
              Upload a document (PDF, Word, or text file) to ask questions about it
            </p>
            <FileUploader onFileUploaded={handleFileUploaded} />
          </Card>
        ) : (
          <ContentViewer 
            type={
              youtubeVideoId 
                ? "youtube" 
                : uploadedFile?.type.includes("pdf") 
                  ? "pdf" 
                  : uploadedFile?.type.includes("word") || uploadedFile?.type.includes("doc") 
                    ? "doc" 
                    : "txt"
            } 
            title={uploadedFile?.name || (youtubeVideoId ? "YouTube Video" : "")}
            file={uploadedFile || undefined}
            videoId={youtubeVideoId || undefined}
            onBack={() => {
              setUploadedFile(null);
              setYoutubeVideoId(null);
            }}
          />
        )}
      </div>
    </ArchiveLayout>
  );
};

export default Index;
