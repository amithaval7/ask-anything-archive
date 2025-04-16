
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileArchive, FileText, Youtube, Upload, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="w-64 border-r bg-card min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
          <FileArchive className="h-5 w-5" />
          <span>Ask Anything Archive</span>
        </h2>
      </div>
      
      <Separator />
      
      <div className="p-4">
        <Button 
          variant="default" 
          className="w-full justify-start gap-2 bg-accent hover:bg-accent/90"
          onClick={() => navigate("/upload")}
        >
          <Plus className="h-4 w-4" />
          Add New Content
        </Button>
      </div>
      
      <Separator />
      
      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="p-4 space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground mb-2">Your Content</h3>
          
          <div className="space-y-1">
            <Button 
              variant={location.pathname === "/" ? "secondary" : "ghost"} 
              className="w-full justify-start gap-2"
              onClick={() => navigate("/")}
            >
              <FileText className="h-4 w-4" />
              <span>Sample Document.pdf</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-muted-foreground"
            >
              <Youtube className="h-4 w-4" />
              <span>YouTube Introduction</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-muted-foreground"
            >
              <FileText className="h-4 w-4" />
              <span>Notes.txt</span>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
