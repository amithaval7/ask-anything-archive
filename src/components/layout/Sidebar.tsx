
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileArchive, FileText, Youtube, FileType, Home, File, Upload } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

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
      
      <div className="p-4 space-y-2">
        <Button 
          variant={location.pathname === "/" ? "secondary" : "ghost"} 
          className="w-full justify-start gap-2"
          onClick={() => navigate("/")}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Button>
        
        <Separator className="my-2" />
        
        <h3 className="text-sm font-medium text-muted-foreground px-2 py-1">Upload Documents</h3>
        
        <Button 
          variant={location.pathname === "/upload/pdf" ? "secondary" : "ghost"}
          className="w-full justify-start gap-2"
          onClick={() => navigate("/upload/pdf")}
        >
          <FileText className="h-4 w-4 text-red-500" />
          <span>Upload a PDF</span>
        </Button>
        
        <Button 
          variant={location.pathname === "/upload/word" ? "secondary" : "ghost"}
          className="w-full justify-start gap-2"
          onClick={() => navigate("/upload/word")}
        >
          <File className="h-4 w-4 text-blue-500" />
          <span>Upload a Word Doc</span>
        </Button>
        
        <Button 
          variant={location.pathname === "/upload/text" ? "secondary" : "ghost"}
          className="w-full justify-start gap-2"
          onClick={() => navigate("/upload/text")}
        >
          <FileType className="h-4 w-4 text-gray-500" />
          <span>Upload a Text File</span>
        </Button>
        
        <Button 
          variant={location.pathname === "/upload/youtube" ? "secondary" : "ghost"}
          className="w-full justify-start gap-2"
          onClick={() => navigate("/upload/youtube")}
        >
          <Youtube className="h-4 w-4 text-red-500" />
          <span>Add a YouTube Video</span>
        </Button>
        
        <Separator className="my-2" />
        
        <h3 className="text-sm font-medium text-muted-foreground px-2 py-1">My Documents</h3>
        
        <Button 
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => navigate("/documents")}
        >
          <Upload className="h-4 w-4" />
          <span>View All Documents</span>
        </Button>
      </div>
      
      <div className="px-4 mt-auto p-4 absolute bottom-0 w-full">
        <Separator className="mb-4" />
        <p className="text-xs text-muted-foreground text-center">
          Document Assistant v1.0
        </p>
      </div>
    </div>
  );
};
