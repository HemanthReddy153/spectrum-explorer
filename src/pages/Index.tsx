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
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <ColorMagicHeader />
        
        {/* Controls Section */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-8">
          <ColorModelSelector 
            selectedModel={selectedModel} 
            onModelChange={setSelectedModel} 
          />
          <ViewToggle 
            showOriginal={showOriginal}
            onToggle={() => setShowOriginal(!showOriginal)}
            selectedModel={selectedModel}
          />
          <ColorAdjustmentPanel
            selectedModel={selectedModel}
            onAdjustmentChange={setAdjustments}
          />
        </div>

        {/* Image Workspace */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Image Workspace</h2>
          <ImageWorkspace
            selectedModel={selectedModel}
            showOriginal={showOriginal}
            adjustments={adjustments}
          />
        </div>

        {/* Main Gallery */}
        <ImageGallery 
          selectedModel={selectedModel}
          showOriginal={showOriginal}
          adjustments={adjustments}
        />
      </div>
    </div>
  );
};

export default Index;
