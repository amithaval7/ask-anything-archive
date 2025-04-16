
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileArchive, FileText, Youtube, Upload, Plus, FileCheck } from "lucide-react";
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
          variant="default" 
          className="w-full justify-start gap-2 bg-primary hover:bg-primary/90"
          onClick={() => navigate("/upload")}
        >
          <Plus className="h-4 w-4" />
          <span>Add New Document</span>
        </Button>
      </div>
      
      <Separator />
      
      <div className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Available Documents</h3>
        
        <div className="space-y-2">
          <Card className="bg-secondary/50 border-primary/20 hover:bg-secondary">
            <Button 
              variant={location.pathname === "/" ? "ghost" : "ghost"} 
              className="w-full justify-start gap-2 p-3"
              onClick={() => navigate("/")}
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
              disabled
            >
              <Youtube className="h-4 w-4 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">Upload a YouTube video</p>
                <p className="text-xs text-muted-foreground">Add from the upload page</p>
              </div>
            </Button>
          </Card>
        </div>
      </div>
      
      <div className="px-4 mt-4">
        <Separator />
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Upload documents to ask questions about their content
          </p>
        </div>
      </div>
    </div>
  );
};
