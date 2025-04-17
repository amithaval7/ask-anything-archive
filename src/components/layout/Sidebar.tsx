
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileArchive, FileText, Youtube, Upload, Plus, FileCheck, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="w-64 border-r bg-card min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
          <FileArchive className="h-5 w-5" />
          <span>Document Assistant</span>
        </h2>
      </div>
      
      <Separator />
      
      <div className="p-4">
        <Button 
          variant="secondary" 
          className="w-full justify-start gap-2 mb-2"
          onClick={() => navigate("/")}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Button>
        
        <Button 
          variant="default" 
          className="w-full justify-start gap-2 bg-primary hover:bg-primary/90"
          onClick={() => navigate("/upload")}
        >
          <Plus className="h-4 w-4" />
          <span>Add New Document</span>
        </Button>
      </div>
      
      <Separator />
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Available Documents</h3>
          
          <div className="space-y-2">
            <Card className={`hover:bg-secondary ${location.pathname === "/" ? "border-primary/50 bg-secondary/50" : "bg-secondary/20 border-muted"}`}>
              <Button 
                variant="ghost"
                className="w-full justify-start gap-2 p-3"
                onClick={() => {
                  // Create and load a sample document
                  localStorage.setItem('uploadedFileName', 'Sample Document.pdf');
                  localStorage.setItem('uploadedFileType', 'application/pdf');
                  navigate("/");
                  // The sample document will be loaded on the index page
                }}
              >
                <FileCheck className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Sample Document.pdf</p>
                  <p className="text-xs text-muted-foreground">Example document for testing</p>
                </div>
              </Button>
            </Card>
            
            <Card className="bg-secondary/20 border-muted hover:bg-secondary/30">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 p-3"
                onClick={() => navigate("/upload")}
              >
                <Upload className="h-4 w-4 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">Upload a file</p>
                  <p className="text-xs text-muted-foreground">Add from the upload page</p>
                </div>
              </Button>
            </Card>
            
            <Card className="bg-secondary/20 border-muted hover:bg-secondary/30">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 p-3"
                onClick={() => navigate("/upload")}
              >
                <Youtube className="h-4 w-4 text-red-500" />
                <div className="text-left">
                  <p className="font-medium">Add a YouTube video</p>
                  <p className="text-xs text-muted-foreground">Add from the upload page</p>
                </div>
              </Button>
            </Card>
          </div>
        </div>
      </ScrollArea>
      
      <div className="px-4 mt-auto p-4">
        <Separator className="mb-4" />
        <p className="text-xs text-muted-foreground text-center">
          Upload documents to ask questions about their content
        </p>
      </div>
    </div>
  );
};
