import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ColorModel, RGBColor, HSVColor, CMYKColor, LABColor, YUVColor } from "@/utils/colorConversions";
import { Palette, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ColorAdjustmentPanelProps {
  selectedModel: ColorModel;
  onAdjustmentChange: (adjustments: ColorAdjustments) => void;
}

export interface ColorAdjustments {
  rgb?: Partial<RGBColor>;
  hsv?: Partial<HSVColor>;
  cmyk?: Partial<CMYKColor>;
  lab?: Partial<LABColor>;
  yuv?: Partial<YUVColor>;
}

const defaultAdjustments: ColorAdjustments = {
  rgb: { r: 0, g: 0, b: 0 },
  hsv: { h: 0, s: 0, v: 0 },
  cmyk: { c: 0, m: 0, y: 0, k: 0 },
  lab: { l: 0, a: 0, b: 0 },
  yuv: { y: 0, u: 0, v: 0 }
};

export function ColorAdjustmentPanel({ selectedModel, onAdjustmentChange }: ColorAdjustmentPanelProps) {
  const [adjustments, setAdjustments] = useState<ColorAdjustments>(defaultAdjustments);

  const handleReset = () => {
    setAdjustments(defaultAdjustments);
    onAdjustmentChange(defaultAdjustments);
  };

  const updateAdjustment = (model: string, channel: string, value: number[]) => {
    const newAdjustments = {
      ...adjustments,
      [model]: {
        ...adjustments[model as keyof ColorAdjustments],
        [channel]: value[0]
      }
    };
    setAdjustments(newAdjustments);
    onAdjustmentChange(newAdjustments);
  };

  useEffect(() => {
    handleReset();
  }, [selectedModel]);

  const renderSliders = () => {
    switch (selectedModel) {
      case 'RGB':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-destructive">Red</label>
                <span className="text-xs text-muted-foreground">{adjustments.rgb?.r || 0}</span>
              </div>
              <Slider
                value={[adjustments.rgb?.r || 0]}
                onValueChange={(value) => updateAdjustment('rgb', 'r', value)}
                min={-255}
                max={255}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-secondary">Green</label>
                <span className="text-xs text-muted-foreground">{adjustments.rgb?.g || 0}</span>
              </div>
              <Slider
                value={[adjustments.rgb?.g || 0]}
                onValueChange={(value) => updateAdjustment('rgb', 'g', value)}
                min={-255}
                max={255}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-primary">Blue</label>
                <span className="text-xs text-muted-foreground">{adjustments.rgb?.b || 0}</span>
              </div>
              <Slider
                value={[adjustments.rgb?.b || 0]}
                onValueChange={(value) => updateAdjustment('rgb', 'b', value)}
                min={-255}
                max={255}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'HSV':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-accent">Hue</label>
                <span className="text-xs text-muted-foreground">{adjustments.hsv?.h || 0}°</span>
              </div>
              <Slider
                value={[adjustments.hsv?.h || 0]}
                onValueChange={(value) => updateAdjustment('hsv', 'h', value)}
                min={-180}
                max={180}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-primary">Saturation</label>
                <span className="text-xs text-muted-foreground">{adjustments.hsv?.s || 0}%</span>
              </div>
              <Slider
                value={[adjustments.hsv?.s || 0]}
                onValueChange={(value) => updateAdjustment('hsv', 's', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-secondary">Value</label>
                <span className="text-xs text-muted-foreground">{adjustments.hsv?.v || 0}%</span>
              </div>
              <Slider
                value={[adjustments.hsv?.v || 0]}
                onValueChange={(value) => updateAdjustment('hsv', 'v', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'CMYK':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-secondary">Cyan</label>
                <span className="text-xs text-muted-foreground">{adjustments.cmyk?.c || 0}%</span>
              </div>
              <Slider
                value={[adjustments.cmyk?.c || 0]}
                onValueChange={(value) => updateAdjustment('cmyk', 'c', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-accent">Magenta</label>
                <span className="text-xs text-muted-foreground">{adjustments.cmyk?.m || 0}%</span>
              </div>
              <Slider
                value={[adjustments.cmyk?.m || 0]}
                onValueChange={(value) => updateAdjustment('cmyk', 'm', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-destructive">Yellow</label>
                <span className="text-xs text-muted-foreground">{adjustments.cmyk?.y || 0}%</span>
              </div>
              <Slider
                value={[adjustments.cmyk?.y || 0]}
                onValueChange={(value) => updateAdjustment('cmyk', 'y', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Black</label>
                <span className="text-xs text-muted-foreground">{adjustments.cmyk?.k || 0}%</span>
              </div>
              <Slider
                value={[adjustments.cmyk?.k || 0]}
                onValueChange={(value) => updateAdjustment('cmyk', 'k', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'LAB':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Lightness</label>
                <span className="text-xs text-muted-foreground">{adjustments.lab?.l || 0}</span>
              </div>
              <Slider
                value={[adjustments.lab?.l || 0]}
                onValueChange={(value) => updateAdjustment('lab', 'l', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-secondary">A (Green-Red)</label>
                <span className="text-xs text-muted-foreground">{adjustments.lab?.a || 0}</span>
              </div>
              <Slider
                value={[adjustments.lab?.a || 0]}
                onValueChange={(value) => updateAdjustment('lab', 'a', value)}
                min={-128}
                max={128}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-primary">B (Blue-Yellow)</label>
                <span className="text-xs text-muted-foreground">{adjustments.lab?.b || 0}</span>
              </div>
              <Slider
                value={[adjustments.lab?.b || 0]}
                onValueChange={(value) => updateAdjustment('lab', 'b', value)}
                min={-128}
                max={128}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'YUV':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Luma (Y)</label>
                <span className="text-xs text-muted-foreground">{adjustments.yuv?.y || 0}</span>
              </div>
              <Slider
                value={[adjustments.yuv?.y || 0]}
                onValueChange={(value) => updateAdjustment('yuv', 'y', value)}
                min={-255}
                max={255}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-primary">U (Blue)</label>
                <span className="text-xs text-muted-foreground">{adjustments.yuv?.u || 0}</span>
              </div>
              <Slider
                value={[adjustments.yuv?.u || 0]}
                onValueChange={(value) => updateAdjustment('yuv', 'u', value)}
                min={-255}
                max={255}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-destructive">V (Red)</label>
                <span className="text-xs text-muted-foreground">{adjustments.yuv?.v || 0}</span>
              </div>
              <Slider
                value={[adjustments.yuv?.v || 0]}
                onValueChange={(value) => updateAdjustment('yuv', 'v', value)}
                min={-255}
                max={255}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Palette className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              {selectedModel} Adjustments
            </h3>
            <p className="text-sm text-muted-foreground">
              Fine-tune color values in real-time
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="border-border hover:bg-muted"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {renderSliders()}
    </Card>
  );
}