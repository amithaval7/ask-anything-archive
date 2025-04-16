
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Send, Loader2 } from "lucide-react";

interface QuestionInterfaceProps {
  documentType: "pdf" | "doc" | "txt" | "youtube";
}

interface Message {
  role: "user" | "system";
  content: string;
  timestamp: Date;
}

export const QuestionInterface = ({ documentType }: QuestionInterfaceProps) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: `I've analyzed your ${documentType === "youtube" ? "YouTube video" : documentType.toUpperCase() + " document"}. Ask any questions about it, and I'll help answer them based on the content.`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || isLoading) return;
    
    // Add user question
    const newUserMessage: Message = {
      role: "user",
      content: question,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setQuestion("");
    setIsLoading(true);
    
    // Simulate API response
    setTimeout(() => {
      let responseContent = "";
      
      switch (documentType) {
        case "pdf":
          responseContent = "Based on the PDF content, the answer to your question is... [Sample response that would be generated based on actual PDF content in a real application]";
          break;
        case "youtube":
          responseContent = "After analyzing the YouTube video, I found that... [Sample response that would be generated based on actual video content in a real application]";
          break;
        case "doc":
          responseContent = "According to the Word document, the information shows that... [Sample response based on document content]";
          break;
        default:
          responseContent = "The text file indicates that... [Sample response based on text file content]";
      }
      
      const newSystemMessage: Message = {
        role: "system",
        content: responseContent,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newSystemMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
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
            <div className="max-w-[80%] rounded-lg p-4 bg-muted flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>Analyzing content...</p>
            </div>
          </div>
        )}
      </div>
      
      <Separator />
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex gap-2">
          <Textarea 
            placeholder={`Ask a question about this ${documentType.toUpperCase()} document...`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[60px]"
          />
          <Button type="submit" size="icon" disabled={!question.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
