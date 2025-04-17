
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArchiveLayout } from "@/components/layout/ArchiveLayout";
import { ContentViewer } from "@/components/content/ContentViewer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const DocumentView = () => {
  const { fileName } = useParams<{ fileName: string }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocument = async () => {
      setError(null);
      // This is just an example, in a real app you would fetch the file from a server
      // For this demo, we'll check localStorage
      const storedFileName = localStorage.getItem('uploadedFileName');
      const storedFileType = localStorage.getItem('uploadedFileType');
      
      try {
        if (fileName === 'sample') {
          // Create a sample file with more substantial content
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
          
          const sampleFile = new File(
            [sampleContent], 
            "Sample Document.pdf", 
            { type: "application/pdf" }
          );
          setFile(sampleFile);
        } else if (storedFileName && storedFileType && decodeURIComponent(fileName || '') === storedFileName) {
          // Create a placeholder file since we can't store actual files in localStorage
          // For PDFs, use a more substantial placeholder to ensure content is always available
          let placeholderContent = `This is content for ${storedFileName}. In a real application, 
          the actual file content would be loaded from a server or database.`;
          
          // Add extra content for PDF files to ensure there's text to process
          if (storedFileType.includes('pdf')) {
            placeholderContent += `
            
            This document appears to be a PDF file.
            
            PDF files can contain various types of content including:
            - Text data
            - Images and graphics
            - Forms and interactive elements
            - Document metadata
            
            The Document Assistant will analyze this content and provide answers based on what it finds.
            Feel free to ask questions about this document!`;
          }
          
          const placeholderFile = new File([placeholderContent], storedFileName, { type: storedFileType });
          setFile(placeholderFile);
        } else {
          setError("Document not found");
          toast.error("Document not found", {
            description: "The document you're looking for doesn't exist or has been removed."
          });
          navigate('/');
        }
      } catch (e) {
        console.error("Error loading document:", e);
        setError("Failed to load document");
        toast.error("Failed to load document", {
          description: "There was an error loading this document. Please try again."
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadDocument();
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

  if (!file || error) {
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
        
        {file.type.includes('pdf') && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>PDF Support</AlertTitle>
            <AlertDescription>
              Some PDF files may have limited text extraction capabilities. If you experience issues, 
              try with a text-based PDF or convert your PDF to text first.
            </AlertDescription>
          </Alert>
        )}
        
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
