
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { setApiKey, getApiKey } from '@/services/aiService';
import { toast } from 'sonner';

export const ApiKeyInput = () => {
  const [apiKey, setApiKeyState] = useState(getApiKey());
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    setApiKey(apiKey);
    toast.success("API key saved successfully!");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          <span>API Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OpenAI API Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              OpenAI API Key
              <span className="text-xs text-muted-foreground ml-2">
                (required for document analysis)
              </span>
            </label>
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally in your browser and is never sent to our servers.
            </p>
          </div>
          <Button onClick={handleSave} className="w-full">
            Save API Key
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
