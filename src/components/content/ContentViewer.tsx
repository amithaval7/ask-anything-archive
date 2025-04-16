
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, Youtube } from "lucide-react";
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
  onBack?: () => void;
}

export const ContentViewer = ({ type, title, file, videoId, onBack }: ContentViewerProps) => {
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const processContent = async () => {
      setIsLoading(true);
      try {
        if (file) {
          const text = await extractTextFromFile(file);
          setExtractedText(text);
        } else if (videoId) {
          const text = await extractTextFromYouTube(videoId);
          setExtractedText(text);
        }
      } catch (error) {
        console.error("Error processing content:", error);
        toast.error("Failed to process the content. Please try again.");
        setExtractedText(null);
      } finally {
        setIsLoading(false);
      }
    };

    processContent();
  }, [file, videoId, type]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        )}
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

      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Document Preview</h2>
          <div className="bg-muted rounded-lg p-4 max-h-40 overflow-y-auto text-sm">
            {isLoading ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                <span className="ml-2">Processing document...</span>
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
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-2">Ask Questions</h2>
          <QuestionInterface documentType={type} documentContent={extractedText} />
        </div>
      </Card>
    </div>
  );
};
