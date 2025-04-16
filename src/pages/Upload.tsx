
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArchiveLayout } from "@/components/layout/ArchiveLayout";
import { FileUploader } from "@/components/upload/FileUploader";
import { YouTubeInput } from "@/components/upload/YouTubeInput";
import { Upload, Youtube } from "lucide-react";

const UploadPage = () => {
  return (
    <ArchiveLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Add New Content</h1>
          <p className="text-muted-foreground">
            Upload documents or add YouTube links to ask questions about later
          </p>
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
            <FileUploader />
          </TabsContent>
          <TabsContent value="youtube" className="py-6">
            <YouTubeInput />
          </TabsContent>
        </Tabs>
      </div>
    </ArchiveLayout>
  );
};

export default UploadPage;
