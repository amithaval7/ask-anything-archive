
import { ArchiveLayout } from "@/components/layout/ArchiveLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Youtube, Send, Link } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UploadYoutube = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleSubmit = () => {
    if (!url.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const videoId = extractVideoId(url);
      
      if (!videoId) {
        toast.error("Invalid YouTube URL. Please enter a valid YouTube video link.");
        setIsSubmitting(false);
        return;
      }
      
      // Store video ID
      localStorage.setItem('youtubeVideoId', videoId);
      
      toast.success("YouTube video added successfully!");
      
      // Navigate to the video view
      navigate(`/youtube/${videoId}`);
    } catch (error) {
      console.error("Error processing YouTube URL:", error);
      toast.error("Failed to process YouTube URL. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  return (
    <ArchiveLayout>
      <div className="max-w-3xl mx-auto space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Add YouTube Video</h1>
          <p className="text-muted-foreground">
            Analyze and ask questions about YouTube video content
          </p>
        </div>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              YouTube Video Link
            </CardTitle>
            <CardDescription>
              Enter the URL of a YouTube video to analyze
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Link className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !url.trim()}
                className="w-full gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Processing..." : "Submit YouTube Video"}
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Supported formats:</p>
              <ul className="space-y-1 list-disc pl-5">
                <li>https://www.youtube.com/watch?v=VIDEOID</li>
                <li>https://youtu.be/VIDEOID</li>
                <li>https://youtube.com/embed/VIDEOID</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </ArchiveLayout>
  );
};

export default UploadYoutube;
