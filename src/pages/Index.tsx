
import { ArchiveLayout } from "@/components/layout/ArchiveLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Youtube, FileType, File, ArrowRight, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <ArchiveLayout>
      <div className="max-w-5xl mx-auto space-y-8 p-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Document Assistant</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload documents or YouTube videos and ask questions to get instant answers based on the content.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Simple steps to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-full">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Upload Your Document</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a PDF, Word document, text file, or YouTube video to analyze
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-full">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Wait for Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Our system extracts and analyzes the content of your document
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-full">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Ask Questions</h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant answers based on the content of your document
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-full">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-medium">Save Your Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Save your question and answer pairs for future reference
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Get Started Now</CardTitle>
              <CardDescription>Choose what type of document to upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 py-6" 
                onClick={() => navigate('/upload/pdf')}
              >
                <FileText className="h-5 w-5 text-red-500" />
                <span className="flex-1 text-left">Upload a PDF Document</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 py-6" 
                onClick={() => navigate('/upload/word')}
              >
                <File className="h-5 w-5 text-blue-500" />
                <span className="flex-1 text-left">Upload a Word Document</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 py-6" 
                onClick={() => navigate('/upload/text')}
              >
                <FileType className="h-5 w-5 text-gray-500" />
                <span className="flex-1 text-left">Upload a Text File</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 py-6" 
                onClick={() => navigate('/upload/youtube')}
              >
                <Youtube className="h-5 w-5 text-red-500" />
                <span className="flex-1 text-left">Add a YouTube Video</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-secondary/30 border-primary/20 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-medium">Try Our Sample Document</h3>
              <p className="text-sm text-muted-foreground">
                Experience the system with our pre-loaded sample
              </p>
            </div>
            <Button 
              className="ml-auto" 
              onClick={() => {
                localStorage.setItem('uploadedFileName', 'Sample Document.pdf');
                localStorage.setItem('uploadedFileType', 'application/pdf');
                navigate("/documents/sample");
              }}
            >
              View Sample
            </Button>
          </div>
        </Card>
      </div>
    </ArchiveLayout>
  );
};

export default Index;
