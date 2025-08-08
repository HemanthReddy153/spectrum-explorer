import { useState } from "react";
import { ColorMagicHeader } from "@/components/ColorMagicHeader";
import { ColorModelSelector } from "@/components/ColorModelSelector";
import { ViewToggle } from "@/components/ViewToggle";
import { ImageGallery } from "@/components/ImageGallery";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ColorAdjustmentPanel, ColorAdjustments } from "@/components/ColorAdjustmentPanel";
import { ColorModel } from "@/utils/colorConversions";

const Index = () => {
  const [selectedModel, setSelectedModel] = useState<ColorModel>('RGB');
  const [showOriginal, setShowOriginal] = useState(true);
  const [adjustments, setAdjustments] = useState<ColorAdjustments>({});

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-gradient-rainbow opacity-5 pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-6">
        <ColorMagicHeader />
        
        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Controls and Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {/* Controls Section - Compact Row */}
            <div className="grid md:grid-cols-3 gap-4">
              <ColorModelSelector 
                selectedModel={selectedModel} 
                onModelChange={setSelectedModel} 
              />
              <ViewToggle 
                showOriginal={showOriginal}
                onToggle={() => setShowOriginal(!showOriginal)}
                selectedModel={selectedModel}
              />
              <div className="md:col-span-1">
                <div className="text-sm font-medium mb-2">Quick Info</div>
                <p className="text-xs text-muted-foreground">
                  Select a color model, drag an image to workspace, and adjust values in real-time
                </p>
              </div>
            </div>

            {/* Image Workspace - Prominent */}
            <div className="bg-card/50 rounded-xl p-6 border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-gradient-primary"></div>
                <h2 className="text-xl font-semibold">Color Analysis Workspace</h2>
              </div>
              <ImageWorkspace
                selectedModel={selectedModel}
                showOriginal={showOriginal}
                adjustments={adjustments}
              />
            </div>
          </div>

          {/* Right Column - Adjustments */}
          <div className="space-y-6">
            <div className="bg-card/30 rounded-xl p-6 border border-border/50 sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <h3 className="text-lg font-semibold">Adjust Colors</h3>
              </div>
              <ColorAdjustmentPanel
                selectedModel={selectedModel}
                onAdjustmentChange={setAdjustments}
              />
            </div>
          </div>
        </div>

        {/* Gallery Section - Below */}
        <div className="mt-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Sample Images</h2>
            <p className="text-muted-foreground">Drag any image to the workspace above to start analyzing</p>
          </div>
          <ImageGallery 
            selectedModel={selectedModel}
            showOriginal={showOriginal}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
