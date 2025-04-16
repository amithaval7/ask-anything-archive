
import { ArchiveLayout } from "@/components/layout/ArchiveLayout";
import { ContentViewer } from "@/components/content/ContentViewer";
import { useState } from "react";
import { FileUploader } from "@/components/upload/FileUploader";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
  };

  return (
    <ArchiveLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {!uploadedFile ? (
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">Upload a Document</h1>
            <p className="text-muted-foreground mb-4">
              Upload a document (PDF, Word, or text file) to ask questions about it
            </p>
            <FileUploader onFileUploaded={handleFileUploaded} />
          </Card>
        ) : (
          <ContentViewer 
            type={uploadedFile.type.includes("pdf") ? "pdf" : 
                 uploadedFile.type.includes("word") || uploadedFile.type.includes("doc") ? "doc" : "txt"} 
            title={uploadedFile.name} 
            file={uploadedFile}
          />
        )}
      </div>
    </ArchiveLayout>
  );
};

export default Index;
