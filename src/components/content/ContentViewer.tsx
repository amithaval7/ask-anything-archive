
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Youtube, Loader2, RefreshCcw, AlertCircle } from "lucide-react";
import { QuestionInterface } from "./QuestionInterface";
import { ApiKeyInput } from "@/components/settings/ApiKeyInput";
import { useEffect, useState } from "react";
import { extractTextFromFile, extractTextFromYouTube } from "@/utils/documentProcessing";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ContentViewerProps {
  type: "pdf" | "doc" | "txt" | "youtube";
  title: string;
  file?: File;
  videoId?: string;
}

export const ContentViewer = ({ type, title, file, videoId }: ContentViewerProps) => {
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const processContent = async () => {
      setIsLoading(true);
      setProcessingError(null);
      
      try {
        if (file) {
          console.log("Processing file:", file.name, file.type);
          
          // Always provide some minimal content even before processing
          // This ensures Q&A interface will work regardless of extraction success
          setExtractedText(`Processing ${file.name}...`);
          
          const text = await extractTextFromFile(file);
          console.log("Extracted text length:", text.length);
          
          if (!text || text.length === 0) {
            throw new Error("No text could be extracted from the document");
          }
          
          setExtractedText(text);
          
          // Store this in localStorage for future reference
          localStorage.setItem('uploadedFileName', file.name);
          localStorage.setItem('uploadedFileType', file.type);
        } else if (videoId) {
          console.log("Processing YouTube video:", videoId);
          const text = await extractTextFromYouTube(videoId);
          console.log("Extracted text length:", text.length);
          setExtractedText(text);
          
          // Store YouTube ID in localStorage
          localStorage.setItem('youtubeVideoId', videoId);
        } else {
          // Create sample content for demonstration if no file or video
          if (title === "Sample Document.pdf" || title.includes("Sample")) {
            const sampleContent = `
            Document Assistant Sample Document
            
            This is a sample document that demonstrates the capabilities of the Document Assistant application.
            
            You can use this document to test the question and answer functionality.
            
            Some key features of Document Assistant:
            - Upload and analyze PDF documents
            - Upload and analyze Word documents
            - Upload and analyze plain text files
            - Add YouTube videos and analyze their content
            - Ask questions about your documents
            - Save your questions and answers for future reference
            
            Try asking questions about this document to see how the Document Assistant works!
            `;
            setExtractedText(sampleContent);
          } else {
            throw new Error("No content provided");
          }
        }
      } catch (error) {
        console.error("Error processing content:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setProcessingError(errorMessage);
        toast.error("Failed to process the content", {
          description: `Error: ${errorMessage}. Try refreshing or uploading again.`
        });
        
        // Set fallback text so the Q&A interface ALWAYS works
        if (file) {
          const fallbackText = `This is fallback content for ${file.name}. The actual content could not be fully processed due to a technical issue.
          
          The document assistant will work with the limited information available. You can still ask questions about this document.
          
          Document details:
          - Name: ${file.name}
          - Type: ${file.type}
          - Size: ${(file.size / 1024).toFixed(2)} KB
          
          Common reasons for processing limitations:
          - PDF files with security restrictions
          - Image-based PDFs without embedded text
          - Corrupted file format
          - Very large documents
          
          You can try uploading a different format or a simplified version of the document.`;
          setExtractedText(fallbackText);
        } else if (videoId) {
          setExtractedText(`This is fallback content for YouTube video ${videoId}. The video content could not be fully processed.
          
          You can still ask questions about this video based on the available information:
          - Video ID: ${videoId}
          - Platform: YouTube
          
          Try asking general questions about the video topic.`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    processContent();
  }, [file, videoId, type, retryCount, title]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast.info("Retrying document processing...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg flex-1">
          {type === "youtube" ? (
            <Youtube className="h-5 w-5 text-red-500 flex-shrink-0" />
          ) : type === "pdf" ? (
            <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
          ) : type === "doc" ? (
            <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
          ) : (
            <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
          )}
          <h1 className="text-xl font-medium truncate">{title}</h1>
        </div>
        <ApiKeyInput />
      </div>

      {processingError && type === "pdf" && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            PDF processing encountered an issue. Using fallback text for Q&A functionality.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Document Preview</h2>
            {processingError && (
              <Button variant="outline" size="sm" onClick={handleRetry} className="flex items-center gap-1">
                <RefreshCcw className="h-4 w-4" /> Retry Processing
              </Button>
            )}
          </div>
          <div className="bg-muted rounded-lg p-4 max-h-[200px] overflow-y-auto text-sm">
            {isLoading ? (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Processing document...</span>
              </div>
            ) : processingError ? (
              <div className="text-center space-y-2">
                <p className="text-red-500">Error processing document: {processingError}</p>
                {extractedText && <p className="text-sm text-muted-foreground">Using fallback text for Q&A</p>}
                <div className="text-left mt-4 border-t pt-2">
                  <p className="whitespace-pre-line">{extractedText ? extractedText.slice(0, 500) + '...' : ''}</p>
                </div>
              </div>
            ) : extractedText ? (
              <p className="whitespace-pre-line">{extractedText.slice(0, 500)}...</p>
            ) : (
              <p className="text-center text-muted-foreground">
                {type === "youtube" ? 
                  "YouTube content would be displayed here" :
                  `${type.toUpperCase()} document preview would be shown here`}
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium mb-3">Ask Questions About This Document</h2>
          <QuestionInterface 
            documentType={type} 
            documentContent={extractedText}
            documentTitle={title} 
          />
        </Card>
      </div>
    </div>
  );
};
