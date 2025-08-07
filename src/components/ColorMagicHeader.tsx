import { Card } from "@/components/ui/card";
import { Palette, Sparkles } from "lucide-react";

export function ColorMagicHeader() {
  return (
    <div className="text-center space-y-6 mb-12">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-rainbow opacity-20 blur-3xl"></div>
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <Palette className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Color Magic
            </h1>
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the fascinating world of color models and transformations. 
            Discover how images look in different color spaces and learn about the science behind digital colors.
          </p>
        </div>
      </div>

      {/* Educational Content */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 text-left">
          <div className="space-y-2">
            <h3 className="font-semibold text-primary">RGB</h3>
            <p className="text-sm text-muted-foreground">
              Red, Green, Blue additive color model used in digital displays. Perfect for screens and digital art.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-secondary">HSV</h3>
            <p className="text-sm text-muted-foreground">
              Hue, Saturation, Value model that's intuitive for artists and designers to work with colors.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-accent">CMYK</h3>
            <p className="text-sm text-muted-foreground">
              Cyan, Magenta, Yellow, Key (Black) subtractive model used in printing and publishing.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-primary-glow">LAB</h3>
            <p className="text-sm text-muted-foreground">
              Lightness, A*, B* perceptual color space designed to approximate human vision.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-secondary">YUV</h3>
            <p className="text-sm text-muted-foreground">
              Luma (brightness) and Chrominance color encoding used in video transmission systems.
            </p>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">How to Use Color Magic</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Select a color model from the dropdown below, then hover over any image to see the pixel color values in real-time. 
          Toggle between original and transformed views to see how images appear in different color spaces. 
          Upload your own images to explore their unique color characteristics!
        </p>
      </div>
    </div>
  );
}