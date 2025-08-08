import { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ColorModel, getColorInModel, transformImageData } from "@/utils/colorConversions";
import { ColorAdjustments } from "@/components/ColorAdjustmentPanel";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageWorkspaceProps {
  selectedModel: ColorModel;
  showOriginal: boolean;
  adjustments?: ColorAdjustments;
  onImageDrop?: (imageUrl: string) => void;
}

export function ImageWorkspace({ selectedModel, showOriginal, adjustments, onImageDrop }: ImageWorkspaceProps) {
  const [workspaceImage, setWorkspaceImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [colorInfo, setColorInfo] = useState<string>('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const drawImageOnCanvas = useCallback((image: HTMLImageElement, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate dimensions to fit the workspace while maintaining aspect ratio
    const maxWidth = 400;
    const maxHeight = 300;
    const ratio = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
    
    canvas.width = image.naturalWidth * ratio;
    canvas.height = image.naturalHeight * ratio;
    
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Check if any adjustments have been made
    const hasAdjustments = adjustments && Object.values(adjustments).some(modelAdjustments => 
      modelAdjustments && Object.values(modelAdjustments).some(value => value !== 0)
    );

    // Show transformations if not showing original OR if adjustments have been made
    if (!showOriginal || hasAdjustments) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const transformedData = transformImageData(imageData, selectedModel, adjustments);
      ctx.putImageData(transformedData, 0, 0);
    }
  }, [showOriginal, selectedModel, adjustments]);

  // Redraw canvas when adjustments, model, or view mode changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (canvas && image && image.complete && workspaceImage) {
      drawImageOnCanvas(image, canvas);
    }
  }, [drawImageOnCanvas, adjustments, selectedModel, showOriginal, workspaceImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    // Check if it's a file being dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setWorkspaceImage(event.target.result as string);
            onImageDrop?.(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Check if it's an image URL from the gallery
    const imageUrl = e.dataTransfer.getData('text/plain');
    if (imageUrl && (imageUrl.startsWith('data:') || imageUrl.includes('.jpg') || imageUrl.includes('.png'))) {
      setWorkspaceImage(imageUrl);
      onImageDrop?.(imageUrl);
    }
  }, [onImageDrop]);

  // Touch support for mobile devices
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Store the initial touch position for potential drag operations
    const touch = e.touches[0];
    if (touch) {
      // You can implement touch drag logic here if needed
    }
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setWorkspaceImage(e.target.result as string);
          onImageDrop?.(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageDrop]);

  const getEventPosition = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if ('touches' in event) {
      // Touch event
      const touch = event.touches[0] || event.changedTouches[0];
      return { clientX: touch.clientX, clientY: touch.clientY };
    } else {
      // Mouse event
      return { clientX: event.clientX, clientY: event.clientY };
    }
  };

  const handleInteraction = useCallback((event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const position = getEventPosition(event);
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((position.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((position.clientY - rect.top) * (canvas.height / rect.height));

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imageData = ctx.getImageData(x, y, 1, 1);
      const pixel = imageData.data;
      const rgb = { r: pixel[0], g: pixel[1], b: pixel[2] };
      const colorValue = getColorInModel(rgb, selectedModel);
      
      setColorInfo(colorValue);
      setMousePos({ x: position.clientX, y: position.clientY });
    } catch (error) {
      // Ignore canvas security errors
    }
  }, [selectedModel]);

  const clearWorkspace = () => {
    setWorkspaceImage(null);
    setColorInfo('');
  };

  return (
    <div className="relative">
      <Card 
        className={`p-6 min-h-[350px] flex items-center justify-center border-2 transition-smooth relative touch-manipulation ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : workspaceImage 
              ? 'border-border' 
              : 'border-dashed border-primary/30 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onTouchStart={handleTouchStart}
        onClick={() => !workspaceImage && fileInputRef.current?.click()}
      >
        {workspaceImage ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[300px] object-contain cursor-crosshair rounded-lg touch-manipulation"
              onMouseMove={handleInteraction}
              onTouchMove={handleInteraction}
              onMouseLeave={() => setColorInfo('')}
              onTouchEnd={() => setColorInfo('')}
              style={{ imageRendering: 'pixelated' }}
            />
            <img
              ref={imageRef}
              src={workspaceImage}
              alt="Workspace"
              className="hidden"
              onLoad={(e) => {
                const imgElement = e.target as HTMLImageElement;
                const canvas = canvasRef.current;
                if (canvas) {
                  drawImageOnCanvas(imgElement, canvas);
                }
              }}
              crossOrigin="anonymous"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={clearWorkspace}
            >
              <X className="w-4 h-4" />
            </Button>
            
            {/* Color Model Badge */}
            {!showOriginal && selectedModel !== 'RGB' && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full">
                {selectedModel}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 text-center cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xl font-semibold">Drop Image Here</p>
              <p className="text-sm text-muted-foreground">
                Drag an image from the gallery below or drop a file to analyze
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Click here to browse files
              </p>
              <p className="text-xs text-muted-foreground mt-1 mobile-drag-hint md:hidden">
                On mobile: Tap to select files or long-press gallery images to interact
              </p>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </Card>

      {/* Color Tooltip */}
      {colorInfo && workspaceImage && (
        <div
          className="color-tooltip visible"
          style={{
            left: `${mousePos.x + 10}px`,
            top: `${mousePos.y - 40}px`,
          }}
        >
          {colorInfo}
        </div>
      )}
    </div>
  );
}