
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArchiveLayout } from "@/components/layout/ArchiveLayout";
import { ContentViewer } from "@/components/content/ContentViewer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const DocumentView = () => {
  const { fileName } = useParams<{ fileName: string }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is just an example, in a real app you would fetch the file from a server
    // For this demo, we'll check localStorage
    const storedFileName = localStorage.getItem('uploadedFileName');
    const storedFileType = localStorage.getItem('uploadedFileType');
    
    if (fileName === 'sample') {
      // Create a sample file
      const sampleFile = new File(
        ["This is a sample document for testing purposes. It contains text that you can ask questions about."], 
        "Sample Document.pdf", 
        { type: "application/pdf" }
      );
      setFile(sampleFile);
    } else if (storedFileName && storedFileType && decodeURIComponent(fileName || '') === storedFileName) {
      // Create a replacement file since we can't store actual files in localStorage
      const placeholderContent = `This is a placeholder for ${storedFileName}. In a real application, 
      the actual file content would be loaded from a server or database.`;
      
      const placeholderFile = new File([placeholderContent], storedFileName, { type: storedFileType });
      setFile(placeholderFile);
    } else {
      toast.error("Document not found", {
        description: "The document you're looking for doesn't exist or has been removed."
      });
      navigate('/');
    }
    
    setLoading(false);
  }, [fileName, navigate]);

  if (loading) {
    return (
      <ArchiveLayout>
        <div className="max-w-5xl mx-auto p-6 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading document...</p>
          </div>
        </div>
      </ArchiveLayout>
    );
  }

  if (!file) {
    return (
      <ArchiveLayout>
        <div className="max-w-5xl mx-auto p-6">
          <Button variant="outline" onClick={() => navigate('/')} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Button>
          <div className="text-center p-12 border rounded-lg">
            <h1 className="text-2xl font-bold mb-2">Document Not Found</h1>
            <p className="text-muted-foreground">The document you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </ArchiveLayout>
    );
  }

  return (
    <ArchiveLayout>
      <div className="max-w-5xl mx-auto p-6">
        <Button variant="outline" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Button>
        
        <ContentViewer 
          type={
            file.type.includes("pdf") 
              ? "pdf" 
              : file.type.includes("word") || file.type.includes("doc") 
                ? "doc" 
                : "txt"
          }
          title={file.name}
          file={file}
        />
      </div>
    </ArchiveLayout>
  );
};

export default DocumentView;
