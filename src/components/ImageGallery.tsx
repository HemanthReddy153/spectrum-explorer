import { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ColorModel, getColorInModel, transformImageData } from "@/utils/colorConversions";
import { ColorAdjustments } from "@/components/ColorAdjustmentPanel";
import { Upload } from "lucide-react";
import demoBalaji from "@/assets/demo-balaji.jpg";
import demoShiva from "@/assets/demo-shiva.jpg";
import demoGanesha from "@/assets/demo-ganesha.jpg";
import demoKrishna from "@/assets/demo-krishna.jpg";

interface ImageGalleryProps {
  selectedModel: ColorModel;
  showOriginal: boolean;
  adjustments?: ColorAdjustments;
}

interface ImageInfo {
  id: string;
  src: string;
  title: string;
  type: 'demo' | 'uploaded';
}

const demoImages: ImageInfo[] = [
  { id: '1', src: demoBalaji, title: 'Lord Balaji', type: 'demo' },
  { id: '2', src: demoShiva, title: 'Lord Shiva', type: 'demo' },
  { id: '3', src: demoGanesha, title: 'Lord Ganesha', type: 'demo' },
  { id: '4', src: demoKrishna, title: 'Lord Krishna', type: 'demo' },
];

export function ImageGallery({ selectedModel, showOriginal, adjustments }: ImageGalleryProps) {
  const [images, setImages] = useState<ImageInfo[]>(demoImages);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [colorInfo, setColorInfo] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement }>({});
  const imageRefs = useRef<{ [key: string]: HTMLImageElement }>({});

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const newImage: ImageInfo = {
              id: `uploaded-${Date.now()}-${Math.random()}`,
              src: e.target.result as string,
              title: file.name,
              type: 'uploaded'
            };
            setImages(prev => [...prev, newImage]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>, imageId: string) => {
    const canvas = canvasRefs.current[imageId];
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imageData = ctx.getImageData(x, y, 1, 1);
      const pixel = imageData.data;
      const rgb = { r: pixel[0], g: pixel[1], b: pixel[2] };
      const colorValue = getColorInModel(rgb, selectedModel);
      
      setColorInfo(colorValue);
      setMousePos({ x: event.clientX, y: event.clientY });
    } catch (error) {
      // Ignore canvas security errors
    }
  }, [selectedModel]);

  const drawImageOnCanvas = useCallback((image: HTMLImageElement, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.drawImage(image, 0, 0);

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

  // Redraw all canvases when adjustments, model, or view mode changes
  useEffect(() => {
    Object.keys(canvasRefs.current).forEach((imageId) => {
      const canvas = canvasRefs.current[imageId];
      const image = imageRefs.current[imageId];
      if (canvas && image && image.complete) {
        drawImageOnCanvas(image, canvas);
      }
    });
  }, [drawImageOnCanvas, adjustments, selectedModel, showOriginal]);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6 border-dashed border-2 border-primary/30 hover:border-primary/50 transition-smooth cursor-pointer"
            onClick={() => fileInputRef.current?.click()}>
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-lg font-medium">Upload Your Own Images</p>
            <p className="text-sm text-muted-foreground">Click here or drag and drop images to analyze their colors</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </Card>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="group overflow-hidden bg-card border-border hover:shadow-rainbow transition-smooth">
            <div className="relative">
              <canvas
                ref={(el) => {
                  if (el) canvasRefs.current[image.id] = el;
                }}
                className="w-full h-48 object-cover image-hover-effect cursor-crosshair"
                onMouseEnter={() => setHoveredImage(image.id)}
                onMouseLeave={() => {
                  setHoveredImage(null);
                  setColorInfo('');
                }}
                onMouseMove={(e) => handleMouseMove(e, image.id)}
                style={{ imageRendering: 'pixelated' }}
              />
              <img
                src={image.src}
                alt={image.title}
                className="hidden"
                onLoad={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  imageRefs.current[image.id] = imgElement;
                  const canvas = canvasRefs.current[image.id];
                  if (canvas) {
                    drawImageOnCanvas(imgElement, canvas);
                  }
                }}
                crossOrigin="anonymous"
              />
              
              {/* Color Model Badge */}
              {!showOriginal && selectedModel !== 'RGB' && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full">
                  {selectedModel}
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-card-foreground truncate">{image.title}</h3>
              <p className="text-sm text-muted-foreground capitalize">{image.type} image</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Color Tooltip */}
      {hoveredImage && colorInfo && (
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