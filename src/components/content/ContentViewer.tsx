
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Youtube, Loader2 } from "lucide-react";
import { QuestionInterface } from "./QuestionInterface";
import { ApiKeyInput } from "@/components/settings/ApiKeyInput";
import { useEffect, useState } from "react";
import { extractTextFromFile, extractTextFromYouTube } from "@/utils/documentProcessing";
import { toast } from "sonner";

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

  useEffect(() => {
    const processContent = async () => {
      setIsLoading(true);
      setProcessingError(null);
      
      try {
        if (file) {
          console.log("Processing file:", file.name, file.type);
          const text = await extractTextFromFile(file);
          console.log("Extracted text length:", text.length);
          setExtractedText(text);
          
          // Store this in localStorage for future reference
          localStorage.setItem('uploadedFileName', file.name);
          localStorage.setItem('uploadedFileType', file.type);
          
          if (!text || text.length === 0) {
            throw new Error("No text could be extracted from the document");
          }
        } else if (videoId) {
          console.log("Processing YouTube video:", videoId);
          const text = await extractTextFromYouTube(videoId);
          console.log("Extracted text length:", text.length);
          setExtractedText(text);
          
          // Store YouTube ID in localStorage
          localStorage.setItem('youtubeVideoId', videoId);
        } else {
          throw new Error("No content provided");
        }
      } catch (error) {
        console.error("Error processing content:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setProcessingError(errorMessage);
        toast.error("Failed to process the content", {
          description: `Error: ${errorMessage}`
        });
        
        // Set fallback text so the Q&A interface still works
        if (file) {
          setExtractedText(`This is fallback content for ${file.name}. The actual content could not be processed due to an error.`);
        } else if (videoId) {
          setExtractedText(`This is fallback content for YouTube video ${videoId}. The actual content could not be processed due to an error.`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    processContent();
  }, [file, videoId, type]);

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

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-3">Document Preview</h2>
          <div className="bg-muted rounded-lg p-4 max-h-[200px] overflow-y-auto text-sm">
            {isLoading ? (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Processing document...</span>
              </div>
            ) : processingError ? (
              <div className="text-center text-red-500">
                <p>Error processing document: {processingError}</p>
                <p className="text-sm text-muted-foreground mt-2">Using fallback text for Q&A</p>
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
