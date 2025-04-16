
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, Youtube } from "lucide-react";
import { QuestionInterface } from "./QuestionInterface";

interface ContentViewerProps {
  type: "pdf" | "doc" | "txt" | "youtube";
  title: string;
  file?: File;
  onBack?: () => void;
}

export const ContentViewer = ({ type, title, file, onBack }: ContentViewerProps) => {
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
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Document Preview</h2>
          <div className="bg-muted rounded-lg p-4 text-center text-muted-foreground">
            {type === "youtube" ? (
              <p>YouTube content would be displayed here</p>
            ) : (
              <p>{type.toUpperCase()} document preview would be shown here</p>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-2">Ask Questions</h2>
          <QuestionInterface documentType={type} />
        </div>
      </Card>
    </div>
  );
};
