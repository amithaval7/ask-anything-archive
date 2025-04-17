
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArchiveLayout } from "@/components/layout/ArchiveLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, File, FileType, Youtube, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface DocumentItem {
  name: string;
  type: string;
  date: Date;
}

interface VideoItem {
  id: string;
  date: Date;
}

const Documents = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    // In a real app, this would be fetched from a database
    // For this demo, we'll use localStorage
    const fileName = localStorage.getItem('uploadedFileName');
    const fileType = localStorage.getItem('uploadedFileType');
    const videoId = localStorage.getItem('youtubeVideoId');
    
    if (fileName && fileType) {
      setDocuments([{
        name: fileName,
        type: fileType,
        date: new Date()
      }]);
    }
    
    if (videoId) {
      setVideos([{
        id: videoId,
        date: new Date()
      }]);
    }
  }, []);

  const handleDeleteDocument = (name: string) => {
    setDocuments(documents.filter(doc => doc.name !== name));
    toast.success("Document removed successfully");
  };

  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter(video => video.id !== id));
    toast.success("Video removed successfully");
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (fileType.includes('word') || fileType.includes('doc')) return <File className="h-8 w-8 text-blue-500" />;
    if (fileType.includes('text')) return <FileType className="h-8 w-8 text-gray-500" />;
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  return (
    <ArchiveLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Documents</h1>
          <p className="text-muted-foreground">
            All your uploaded documents and YouTube videos
          </p>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Your uploaded files</CardDescription>
          </CardHeader>
          <CardContent>
            {documents.length === 0 && (
              <p className="text-center py-12 text-muted-foreground">
                No documents uploaded yet
              </p>
            )}
            {documents.length > 0 && (
              <div className="space-y-2">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-md hover:bg-accent/5">
                    <div className="flex items-center gap-4">
                      {getFileIcon(doc.type)}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/document/${encodeURIComponent(doc.name)}`)}
                      >
                        View
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Document</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete "{doc.name}"? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline">Cancel</Button>
                            <Button 
                              variant="destructive"
                              onClick={() => handleDeleteDocument(doc.name)}
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>YouTube Videos</CardTitle>
            <CardDescription>Your added YouTube videos</CardDescription>
          </CardHeader>
          <CardContent>
            {videos.length === 0 && (
              <p className="text-center py-12 text-muted-foreground">
                No YouTube videos added yet
              </p>
            )}
            {videos.length > 0 && (
              <div className="space-y-2">
                {videos.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-md hover:bg-accent/5">
                    <div className="flex items-center gap-4">
                      <Youtube className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="font-medium">YouTube Video</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {video.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/youtube/${video.id}`)}
                      >
                        View
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete YouTube Video</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this YouTube video? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline">Cancel</Button>
                            <Button 
                              variant="destructive"
                              onClick={() => handleDeleteVideo(video.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ArchiveLayout>
  );
};

export default Documents;
