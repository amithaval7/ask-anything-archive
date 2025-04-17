
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UploadPdf from "./pages/UploadPdf";
import UploadWord from "./pages/UploadWord";
import UploadText from "./pages/UploadText";
import UploadYoutube from "./pages/UploadYoutube";
import DocumentView from "./pages/DocumentView";
import YoutubeView from "./pages/YoutubeView";
import Documents from "./pages/Documents";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/upload/pdf" element={<UploadPdf />} />
          <Route path="/upload/word" element={<UploadWord />} />
          <Route path="/upload/text" element={<UploadText />} />
          <Route path="/upload/youtube" element={<UploadYoutube />} />
          <Route path="/document/:fileName" element={<DocumentView />} />
          <Route path="/youtube/:videoId" element={<YoutubeView />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/documents/sample" element={<DocumentView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
