
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Youtube } from "lucide-react";
import { QuestionInterface } from "./QuestionInterface";

interface ContentViewerProps {
  type: "pdf" | "doc" | "txt" | "youtube";
  title: string;
}

export const ContentViewer = ({ type, title }: ContentViewerProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {type === "youtube" ? (
            <Youtube className="h-5 w-5 text-red-500" />
          ) : (
            <FileText className="h-5 w-5 text-primary" />
          )}
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="ask">Ask Questions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 py-4">
          {type === "youtube" ? (
            <div className="aspect-video">
              <Card className="flex items-center justify-center h-full bg-muted">
                <div className="text-center p-6">
                  <Youtube className="h-16 w-16 mx-auto text-red-500 mb-4" />
                  <p className="text-muted-foreground">
                    YouTube player would be rendered here in a real application
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="h-[600px] flex items-center justify-center bg-muted">
              <div className="text-center p-6">
                <FileText className="h-16 w-16 mx-auto text-primary/50 mb-4" />
                <p className="text-muted-foreground">
                  {type.toUpperCase()} document would be rendered here in a real application
                </p>
              </div>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="ask" className="py-4">
          <QuestionInterface documentType={type} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
