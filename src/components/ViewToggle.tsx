import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

interface ViewToggleProps {
  showOriginal: boolean;
  onToggle: () => void;
  selectedModel: string;
}

export function ViewToggle({ showOriginal, onToggle, selectedModel }: ViewToggleProps) {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">View Mode</h3>
          <p className="text-sm text-muted-foreground">
            {showOriginal 
              ? "Viewing original images" 
              : `Viewing images transformed to ${selectedModel} color space`
            }
          </p>
        </div>
        <Button
          onClick={onToggle}
          variant={showOriginal ? "outline" : "default"}
          className="flex items-center gap-2 transition-bounce"
        >
          {showOriginal ? (
            <>
              <Eye className="w-4 h-4" />
              Original
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" />
              {selectedModel}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}