
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Send, Loader2, HelpCircle } from "lucide-react";
import { askQuestionAboutDocument } from "@/services/aiService";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface QuestionInterfaceProps {
  documentType: "pdf" | "doc" | "txt" | "youtube";
  documentContent: string | null;
}

interface Message {
  role: "user" | "system";
  content: string;
  timestamp: Date;
}

export const QuestionInterface = ({ documentType, documentContent }: QuestionInterfaceProps) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: documentContent 
        ? `I've analyzed your ${documentType === "youtube" ? "YouTube video" : documentType.toUpperCase() + " document"}. Ask any questions about it, and I'll help answer them based on the content.`
        : `Upload a document to start asking questions.`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || isLoading) return;
    
    // Check if document content is available
    if (!documentContent) {
      toast.error("Please upload a document before asking questions", {
        description: "Your document needs to be processed first."
      });
      return;
    }
    
    // Add user question
    const newUserMessage: Message = {
      role: "user",
      content: question,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setQuestion("");
    setIsLoading(true);
    
    try {
      // Get response using local processing
      const response = await askQuestionAboutDocument(documentContent, question);
      
      const newSystemMessage: Message = {
        role: "system",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newSystemMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      
      toast.error("Error processing your question", {
        description: "Please try again or upload a different document."
      });
      
      const errorMessage: Message = {
        role: "system",
        content: "Sorry, there was an error processing your question. Please try again.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = !question.trim() || isLoading || !documentContent;

  return (
    <Card className="flex flex-col h-[500px] shadow-md border rounded-lg overflow-hidden">
      <div className="bg-card px-4 py-3 flex justify-between items-center border-b">
        <h3 className="font-medium">Document Q&A Assistant</h3>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Help</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to use the document assistant</DialogTitle>
              <DialogDescription>
                <div className="mt-4 space-y-3">
                  <p>1. Make sure you've uploaded a document or selected one from the sidebar.</p>
                  <p>2. Type your question about the document content in the text box.</p>
                  <p>3. Click the send button or press Enter to submit your question.</p>
                  <p>4. The assistant will analyze the document and provide an answer based on the content.</p>
                  <p className="text-sm text-muted-foreground mt-4">This uses local text processing to find relevant information in your document.</p>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                message.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-background border"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-background border flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>Analyzing document...</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <Separator />
      
      <form onSubmit={handleSubmit} className="p-4 bg-card">
        <div className="flex gap-2 items-center">
          <Textarea 
            placeholder={documentContent 
              ? `Ask a question about this ${documentType === "youtube" ? "video" : documentType.toUpperCase() + " document"}...`
              : "Upload a document to start asking questions"
            }
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[60px] resize-none"
            disabled={!documentContent}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isSubmitDisabled) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex flex-col">
            <Button 
              type="submit" 
              size="icon" 
              disabled={isSubmitDisabled}
              className="h-[60px] w-[60px]"
              title={isSubmitDisabled 
                ? (documentContent ? "Please type a question" : "Upload a document first") 
                : "Send question"
              }
            >
              <Send className="h-5 w-5" />
            </Button>
            {!documentContent && (
              <p className="text-xs text-muted-foreground mt-1 text-center">Upload<br/>first</p>
            )}
          </div>
        </div>
      </form>
    </Card>
  );
};
