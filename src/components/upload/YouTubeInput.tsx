
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface YouTubeInputProps {
  onVideoSubmitted?: (videoId: string) => void;
}

export const YouTubeInput = ({ onVideoSubmitted }: YouTubeInputProps) => {
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
        return;
      }
      
      if (onVideoSubmitted) {
        onVideoSubmitted(videoId);
        toast.success("YouTube video added successfully!");
      }
      
      setUrl("");
    } catch (error) {
      console.error("Error processing YouTube URL:", error);
      toast.error("Failed to process YouTube URL. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Add YouTube Video Link</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="youtube-url" className="block text-sm font-medium mb-1">
            YouTube Video URL
          </label>
          <div className="flex gap-2">
            <Input
              id="youtube-url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !url.trim()}
            >
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Supported formats:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>https://www.youtube.com/watch?v=VIDEOID</li>
            <li>https://youtu.be/VIDEOID</li>
            <li>https://youtube.com/embed/VIDEOID</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
