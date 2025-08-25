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
  BarChart3,
  FileText,
  Image as ImageIcon,
  Loader2,
  TrendingUp,
  Upload,
} from "lucide-react";
import { useState } from "react";

export function ContentAnalyser() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setError(null);
      setAnalysisResult(null);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Convert image to base64 for webhook
      const base64Image = await fileToBase64(selectedImage);

      console.log("Sending image to webhook...", {
        filename: selectedImage.name,
        size: selectedImage.size,
        type: selectedImage.type,
      });

      const response = await fetch(
        "https://n8n.srv834400.hstgr.cloud/webhook-test/tokenizatoin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64Image,
            filename: selectedImage.name,
            size: selectedImage.size,
            type: selectedImage.type,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      console.log("Webhook response status:", response.status);
      console.log(
        "Webhook response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Webhook error response:", errorText);
        throw new Error(
          `Webhook error: ${response.status} - ${
            errorText || response.statusText
          }`
        );
      }

      const result = await response.json();
      console.log("Analysis result received:", result);

      if (result && typeof result === "object") {
        setAnalysisResult(result);
      } else {
        throw new Error("Invalid response format from webhook");
      }
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze image");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data:image/...;base64, prefix
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Image Analysis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Image Content Analysis
          </CardTitle>
          <CardDescription>
            Upload an image to analyze its content and get AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image-upload">Select Image</Label>
              <div className="flex gap-2">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="flex-1"
                  disabled={isAnalyzing}
                />
                <Button
                  onClick={analyzeImage}
                  disabled={!selectedImage || isAnalyzing}
                  className="min-w-[120px]"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
                {selectedImage && !isAnalyzing && (
                  <Button onClick={clearImage} variant="outline" size="sm">
                    Clear
                  </Button>
                )}
              </div>
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending image to AI analysis service...
                </div>
              )}
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="space-y-2">
                <Label>Image Preview</Label>
                <div className="border rounded-lg p-4 bg-muted/20">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-sm"
                  />
                  <div className="mt-2 text-sm text-muted-foreground text-center">
                    {selectedImage?.name} (
                    {((selectedImage?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700">Error: {error}</p>
              </div>
            )}

            {/* Analysis Result */}
            {analysisResult && (
              <div className="space-y-4">
                <Label>Analysis Results</Label>
                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h4 className="font-medium text-green-900">
                        Analysis Complete!
                      </h4>
                    </div>

                    {/* Display structured results if available */}
                    {analysisResult.tokens &&
                      Array.isArray(analysisResult.tokens) && (
                        <div className="space-y-3">
                          <h5 className="font-medium text-green-800">
                            Detected Tokens:
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(analysisResult.tokens) &&
                              analysisResult.tokens
                                .filter(
                                  (token): token is string =>
                                    typeof token === "string"
                                )
                                .map((token: string, index: number) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-md border border-green-200"
                                  >
                                    {token}
                                  </span>
                                ))}
                          </div>
                        </div>
                      )}

                    {analysisResult.confidence && (
                      <div className="space-y-2">
                        <h5 className="font-medium text-green-800">
                          Confidence Score:
                        </h5>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (analysisResult.confidence as number) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-green-700">
                          {(
                            (analysisResult.confidence as number) * 100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    )}

                    {/* Raw JSON for debugging */}
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm text-green-700 hover:text-green-800">
                        View Raw Response
                      </summary>
                      <pre className="text-xs text-green-800 bg-white p-3 rounded border overflow-auto max-h-64 mt-2">
                        {JSON.stringify(analysisResult, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Content Performance Analysis
          </CardTitle>
          <CardDescription>
            Analyze your content performance and get insights to improve
            engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">
                  Engagement Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">3.2%</div>
                <p className="text-xs text-blue-700">Average across posts</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">
                  Best Performing
                </CardTitle>
                <FileText className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">Video</div>
                <p className="text-xs text-green-700">Content type</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">
                  Optimal Time
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">9 AM</div>
                <p className="text-xs text-purple-700">Peak engagement</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Content Insights</h3>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Hashtag Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Your posts with #ProductLaunch perform 45% better than
                  average.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Content Length</h4>
                <p className="text-sm text-muted-foreground">
                  Medium-length posts (100-200 characters) get the highest
                  engagement.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Platform Optimization</h4>
                <p className="text-sm text-muted-foreground">
                  Instagram Stories have 2.3x higher engagement than regular
                  posts.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
