import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorModel } from "@/utils/colorConversions";

interface ColorModelSelectorProps {
  selectedModel: ColorModel;
  onModelChange: (model: ColorModel) => void;
}

const colorModels: { value: ColorModel; label: string; description: string }[] = [
  { value: 'RGB', label: 'RGB', description: 'Red, Green, Blue - Additive color model' },
  { value: 'HSV', label: 'HSV', description: 'Hue, Saturation, Value - Intuitive color model' },
  { value: 'CMYK', label: 'CMYK', description: 'Cyan, Magenta, Yellow, Key - Print color model' },
  { value: 'LAB', label: 'LAB', description: 'Lightness, A*, B* - Perceptual color model' },
  { value: 'YUV', label: 'YUV', description: 'Luma, Chrominance - Video color model' },
];

export function ColorModelSelector({ selectedModel, onModelChange }: ColorModelSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Color Model</label>
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-full bg-card border-border hover:bg-muted transition-smooth">
          <SelectValue placeholder="Select a color model" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {colorModels.map((model) => (
            <SelectItem 
              key={model.value} 
              value={model.value}
              className="hover:bg-muted focus:bg-muted cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-medium">{model.label}</span>
                <span className="text-xs text-muted-foreground">{model.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}