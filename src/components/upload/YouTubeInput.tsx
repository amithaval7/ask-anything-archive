
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Youtube, CheckCircle2 } from "lucide-react";

export const YouTubeInput = () => {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateYoutubeUrl = (input: string) => {
    // Simple YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(input);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUrl(input);
    setIsValid(validateYoutubeUrl(input));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      setIsSubmitted(true);
      // In a real app, you'd process the URL here
    }
  };

  const getThumbnail = () => {
    // Extract video ID - simplistic version
    let videoId = "";
    
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    }
    
    return videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : null;
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-500" />
          <h3 className="font-medium">Add YouTube Link</h3>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Paste YouTube URL here"
              value={url}
              onChange={handleChange}
              className={isValid ? "border-green-500" : ""}
            />
          </div>
          <Button type="submit" disabled={!isValid || isSubmitted}>
            {isSubmitted ? "Added" : "Add Link"}
          </Button>
        </div>
        
        {isValid && getThumbnail() && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Video preview:</p>
            <div className="relative rounded-md overflow-hidden aspect-video">
              <img 
                src={getThumbnail()!} 
                alt="YouTube video thumbnail" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Youtube className="h-12 w-12 text-red-500" />
              </div>
            </div>
          </div>
        )}
        
        {isSubmitted && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span>YouTube video added successfully!</span>
          </div>
        )}
      </form>
    </Card>
  );
};
