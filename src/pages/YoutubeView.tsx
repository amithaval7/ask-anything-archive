
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArchiveLayout } from "@/components/layout/ArchiveLayout";
import { ContentViewer } from "@/components/content/ContentViewer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const YoutubeView = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [validVideo, setValidVideo] = useState(false);

  useEffect(() => {
    // Check if this is a valid YouTube video ID
    if (videoId && videoId.length === 11) {
      setValidVideo(true);
    } else {
      toast.error("Invalid YouTube video ID", {
        description: "The YouTube video you're looking for doesn't exist or has an invalid ID."
      });
      navigate('/');
    }
    
    setLoading(false);
  }, [videoId, navigate]);

  if (loading) {
    return (
      <ArchiveLayout>
        <div className="max-w-5xl mx-auto p-6 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading YouTube video...</p>
          </div>
        </div>
      </ArchiveLayout>
    );
  }

  if (!validVideo) {
    return (
      <ArchiveLayout>
        <div className="max-w-5xl mx-auto p-6">
          <Button variant="outline" onClick={() => navigate('/')} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Button>
          <div className="text-center p-12 border rounded-lg">
            <h1 className="text-2xl font-bold mb-2">YouTube Video Not Found</h1>
            <p className="text-muted-foreground">The YouTube video you're looking for doesn't exist or has an invalid ID.</p>
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
        
        <ContentViewer 
          type="youtube"
          title={`YouTube Video (${videoId})`}
          videoId={videoId}
        />
      </div>
    </ArchiveLayout>
  );
};

export default YoutubeView;
