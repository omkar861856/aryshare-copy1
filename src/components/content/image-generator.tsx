"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Download,
  Image as ImageIcon,
  Loader2,
  Palette,
  RefreshCw,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface ImageGenerationOptions {
  prompt: string;
  style: string;
  resolution: string;
  quality: string;
  creativity: number;
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  timestamp: Date;
}

export function ImageGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [options, setOptions] = useState<ImageGenerationOptions>({
    prompt: "",
    style: "photorealistic",
    resolution: "1024x1024",
    quality: "high",
    creativity: 75,
  });

  const artStyles = [
    {
      value: "photorealistic",
      label: "Photorealistic",
      description: "Lifelike images with realistic details",
    },
    {
      value: "cartoon",
      label: "Cartoon",
      description: "Fun, animated cartoon style",
    },
    {
      value: "abstract",
      label: "Abstract",
      description: "Modern abstract art with geometric shapes",
    },
    {
      value: "vintage",
      label: "Vintage",
      description: "Classic retro aesthetic",
    },
    {
      value: "minimalist",
      label: "Minimalist",
      description: "Clean, simple designs",
    },
    {
      value: "3d-render",
      label: "3D Render",
      description: "Three-dimensional computer graphics",
    },
    {
      value: "watercolor",
      label: "Watercolor",
      description: "Soft, flowing paint effects",
    },
    {
      value: "oil-painting",
      label: "Oil Painting",
      description: "Rich, textured brushwork",
    },
  ];

  const resolutions = [
    {
      value: "512x512",
      label: "512x512",
      description: "Small, fast generation",
    },
    { value: "1024x1024", label: "1024x1024", description: "Standard quality" },
    { value: "1024x1536", label: "1024x1536", description: "Portrait format" },
    { value: "1536x1024", label: "1536x1024", description: "Landscape format" },
    { value: "2048x2048", label: "2048x2048", description: "High resolution" },
  ];

  const generateImage = async () => {
    if (!options.prompt.trim()) {
      setError("Please enter a description for your image");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Simulate AI image generation
      const generationTime = Math.random() * 3000 + 2000; // 2-5 seconds

      await new Promise((resolve) => setTimeout(resolve, generationTime));

      // Create a mock generated image
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: `https://picsum.photos/seed/${Date.now()}/400/400`, // Placeholder image
        prompt: options.prompt,
        style: options.style,
        timestamp: new Date(),
      };

      setGeneratedImages((prev) => [newImage, ...prev]);

      // Reset prompt after generation
      setOptions((prev) => ({ ...prev, prompt: "" }));
    } catch {
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (imageUrl: string, prompt: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `ai-generated-${prompt
      .slice(0, 20)
      .replace(/\s+/g, "-")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const regenerateImage = () => {
    if (options.prompt.trim()) {
      generateImage();
    }
  };

  const quickPrompts = [
    "A futuristic city skyline at sunset",
    "A cozy coffee shop interior",
    "A majestic mountain landscape",
    "A modern minimalist workspace",
    "A vibrant flower garden",
    "A sleek sports car on a winding road",
  ];

  return (
    <div className="space-y-6">
      {/* Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Create Your Image
          </CardTitle>
          <CardDescription>
            Describe what you want to see and let AI bring it to life
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="image-prompt">Image Description</Label>
            <div className="flex gap-2">
              <Input
                id="image-prompt"
                placeholder="Describe the image you want to create..."
                value={options.prompt}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, prompt: e.target.value }))
                }
                className="flex-1"
                disabled={isGenerating}
              />
              <Button
                onClick={generateImage}
                disabled={!options.prompt.trim() || isGenerating}
                className="min-w-[140px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Quick Prompts
            </Label>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  onClick={() => setOptions((prev) => ({ ...prev, prompt }))}
                  disabled={isGenerating}
                  className="text-xs"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>

          {/* Generation Options */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Art Style</Label>
              <Select
                value={options.style}
                onValueChange={(value) =>
                  setOptions((prev) => ({ ...prev, style: value }))
                }
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {artStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      <div>
                        <div className="font-medium">{style.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {style.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Resolution</Label>
              <Select
                value={options.resolution}
                onValueChange={(value) =>
                  setOptions((prev) => ({ ...prev, resolution: value }))
                }
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {resolutions.map((res) => (
                    <SelectItem key={res.value} value={res.value}>
                      <div>
                        <div className="font-medium">{res.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {res.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quality</Label>
              <Select
                value={options.quality}
                onValueChange={(value) =>
                  setOptions((prev) => ({ ...prev, quality: value }))
                }
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Fast)</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="high">High (Best)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Creativity Slider */}
          <div className="space-y-2">
            <Label>Creativity Level: {options.creativity}%</Label>
            <Slider
              value={[options.creativity]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) =>
                setOptions((prev) => ({ ...prev, creativity: value[0] }))
              }
              disabled={isGenerating}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>More Realistic</span>
              <span>More Creative</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">Error: {error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Generated Images
            </CardTitle>
            <CardDescription>Your AI-created masterpieces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {generatedImages.map((image) => (
                <div
                  key={image.id}
                  className="border rounded-lg overflow-hidden group"
                >
                  <div className="relative">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => downloadImage(image.url, image.prompt)}
                          className="bg-white text-black hover:bg-gray-100"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setOptions((prev) => ({
                              ...prev,
                              prompt: image.prompt,
                            }));
                            regenerateImage();
                          }}
                          className="bg-white/90 text-black hover:bg-white"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium mb-1">{image.prompt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="capitalize">{image.style}</span>
                      <span>{image.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Generation Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-900">
                  Generated Today
                </CardTitle>
                <Palette className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-900">
                  {generatedImages.length}
                </div>
                <p className="text-xs text-amber-700">Images created</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-pink-900">
                  Styles Available
                </CardTitle>
                <ImageIcon className="h-4 w-4 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-900">
                  {artStyles.length}
                </div>
                <p className="text-xs text-pink-700">Art styles</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-indigo-900">
                  Max Resolution
                </CardTitle>
                <ImageIcon className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-900">4K</div>
                <p className="text-xs text-indigo-700">Maximum quality</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
