
import { ArchiveLayout } from "@/components/layout/ArchiveLayout";
import { ContentViewer } from "@/components/content/ContentViewer";
import { useState, useEffect } from "react";
import { FileUploader } from "@/components/upload/FileUploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiKeyInput } from "@/components/settings/ApiKeyInput";
import { FileText, Upload, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [hasLocalUpload, setHasLocalUpload] = useState<boolean>(false);

  useEffect(() => {
    // Check localStorage for previously uploaded content
    const savedFileName = localStorage.getItem('uploadedFileName');
    const savedVideoId = localStorage.getItem('youtubeVideoId');
    
    if (savedFileName || savedVideoId) {
      setHasLocalUpload(true);
    }
  }, []);

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
    setYoutubeVideoId(null); // Clear YouTube video if a file is uploaded
  };

  const handleYoutubeIdSubmitted = (videoId: string) => {
    setYoutubeVideoId(videoId);
    setUploadedFile(null); // Clear uploaded file if a YouTube video is added
  };

  const handleContinueWithSample = () => {
    // Use the sample document
    // This is just a placeholder - in a real app, we would load a sample document
    setUploadedFile(new File(["Sample document content"], "Sample Document.pdf", { type: "application/pdf" }));
  };

  return (
    <ArchiveLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {!uploadedFile && !youtubeVideoId ? (
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Document Assistant</h1>
                <p className="text-muted-foreground">
                  Upload a document to ask questions about its content
                </p>
              </div>
              <ApiKeyInput />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md overflow-hidden border-muted">
                <CardHeader className="bg-secondary/50 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Sample Document
                  </CardTitle>
                  <CardDescription>
                    Try out the assistant with our sample document
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Use our pre-loaded sample document to explore the document assistant functionality.
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={handleContinueWithSample}
                  >
                    Continue with Sample
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="shadow-md overflow-hidden border-muted">
                <CardHeader className="bg-secondary/50 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Document
                  </CardTitle>
                  <CardDescription>
                    Upload your own document to analyze
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a PDF, Word, or text file to ask questions about its content.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate("/upload")}
                  >
                    Go to Upload Page
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {hasLocalUpload && (
              <Card className="p-4 bg-secondary/30 border-primary/20">
                <div className="flex items-center justify-between">
                  <p>
                    You have previously uploaded documents.
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary"
                    onClick={() => setHasLocalUpload(false)}
                  >
                    Check Sidebar
                  </Button>
                </div>
              </Card>
            )}
          </div>
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
