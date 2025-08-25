"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/contexts/profile-context";
import { useTheme } from "@/contexts/theme-context";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  FileVideo,
  Globe,
  Loader2,
  Share2,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Fixed webhook URL
const WEBHOOK_URL =
  "https://n8n.srv834400.hstgr.cloud/webhook-test/50ae524e-1ec3-439e-8a18-256c2c410f22";

// Rate limiting configuration
const RATE_LIMITS = {
  perMinute: 3,
  perHour: 20,
};

interface RateLimitState {
  minuteCount: number;
  hourCount: number;
  lastMinuteReset: number;
  lastHourReset: number;
}

interface UploadedProject {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  webContentLink: string;
  webViewLink: string;
  createdTime: string;
  modifiedTime: string;
  thumbnailVersion: string;
  hasThumbnail: boolean;
  sourceType?: number;
  url?: string;
  projectId?: string;
}

// Video source types
const VIDEO_SOURCES = {
  1: {
    name: "Remote Video File",
    icon: "🌐",
    color: "blue",
    type: "upload" as const,
  },
  2: { name: "YouTube", icon: "📺", color: "red", type: "stream" as const },
  3: {
    name: "Google Drive",
    icon: "☁️",
    color: "green",
    type: "stream" as const,
  },
  4: { name: "Vimeo", icon: "🎬", color: "blue", type: "stream" as const },
  5: {
    name: "StreamYard",
    icon: "🎥",
    color: "purple",
    type: "stream" as const,
  },
  6: { name: "TikTok", icon: "🎵", color: "black", type: "stream" as const },
  7: { name: "Twitter(X)", icon: "🐦", color: "blue", type: "stream" as const },
  8: { name: "Rumble", icon: "📢", color: "orange", type: "stream" as const },
  9: { name: "Twitch", icon: "🎮", color: "purple", type: "stream" as const },
  10: { name: "Loom", icon: "🔗", color: "blue", type: "stream" as const },
  11: { name: "Facebook", icon: "📘", color: "blue", type: "stream" as const },
  12: { name: "LinkedIn", icon: "💼", color: "blue", type: "stream" as const },
};

export default function VideoClipper() {
  const { theme } = useTheme();
  const { profile } = useProfile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [streamUrl, setStreamUrl] = useState<string>("");
  const [selectedSourceType, setSelectedSourceType] = useState<number>(1);
  const [uploadedProjects, setUploadedProjects] = useState<UploadedProject[]>(
    []
  );
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    minuteCount: 0,
    hourCount: 0,
    lastMinuteReset: Date.now(),
    lastHourReset: Date.now(),
  });
  const [postingToTwitter, setPostingToTwitter] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check rate limits
  const checkRateLimit = useCallback((): {
    allowed: boolean;
    message: string;
  } => {
    const now = Date.now();

    // Reset counters if time has passed
    if (now - rateLimitState.lastMinuteReset >= 60000) {
      // 1 minute
      setRateLimitState((prev) => ({
        ...prev,
        minuteCount: 0,
        lastMinuteReset: now,
      }));
    }

    if (now - rateLimitState.lastHourReset >= 3600000) {
      // 1 hour
      setRateLimitState((prev) => ({
        ...prev,
        hourCount: 0,
        lastHourReset: now,
      }));
    }

    // Check limits
    if (rateLimitState.minuteCount >= RATE_LIMITS.perMinute) {
      return {
        allowed: false,
        message: `Rate limit exceeded: ${RATE_LIMITS.perMinute} requests per minute`,
      };
    }

    if (rateLimitState.hourCount >= RATE_LIMITS.perHour) {
      return {
        allowed: false,
        message: `Rate limit exceeded: ${RATE_LIMITS.perHour} requests per hour`,
      };
    }

    return { allowed: true, message: "" };
  }, [rateLimitState]);

  // Update rate limit counters
  const updateRateLimit = useCallback(() => {
    setRateLimitState((prev) => ({
      ...prev,
      minuteCount: prev.minuteCount + 1,
      hourCount: prev.hourCount + 1,
    }));
  }, []);

  // Check if Twitter is linked to the account
  const isTwitterLinked = useMemo(() => {
    if (!profile) return false;

    // Check if Twitter is in the active social accounts
    if (
      profile.activeSocialAccounts &&
      Array.isArray(profile.activeSocialAccounts)
    ) {
      return profile.activeSocialAccounts.some(
        (platform) =>
          platform.toLowerCase().includes("twitter") ||
          platform.toLowerCase().includes("x")
      );
    }

    // Check display names for Twitter platform
    if (profile.displayNames && Array.isArray(profile.displayNames)) {
      return profile.displayNames.some(
        (account) =>
          account.platform &&
          (account.platform.toLowerCase().includes("twitter") ||
            account.platform.toLowerCase().includes("x"))
      );
    }

    return false;
  }, [profile]);

  // Convert Google Drive URL to direct download format
  const getDirectVideoUrl = (webContentLink: string): string => {
    // If it's already a direct download link, return as is
    if (webContentLink.includes("export=download")) {
      return webContentLink;
    }

    // Convert Google Drive view link to download link
    if (webContentLink.includes("drive.google.com/file/d/")) {
      const fileId = webContentLink.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/uc?id=${fileId}&export=download`;
      }
    }

    // For other URLs, return as is
    return webContentLink;
  };

  // Post video to Twitter using our API route
  const postToTwitter = async (project: UploadedProject) => {
    setPostingToTwitter(project.id);

    try {
      // Validate that we have a valid video URL
      if (
        !project.webContentLink ||
        !project.webContentLink.startsWith("https://")
      ) {
        setUploadStatus("Twitter posting failed: Invalid video URL format");
        return;
      }

      // Convert URL to direct download format if needed
      const directUrl = getDirectVideoUrl(project.webContentLink);

      const response = await fetch("/api/ayrshare/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: `Check out this video: ${project.name}`,
          platforms: ["twitter"],
          mediaUrls: [directUrl],
          isVideo: true,
        }),
      });

      const result = await response.json();

      // Debug: Log the full response to understand the structure
      console.log("Ayrshare API response:", {
        status: response.status,
        statusText: response.statusText,
        result: result,
        originalUrl: project.webContentLink,
        directUrl: directUrl,
      });

      // Handle the response based on Ayrshare's status, not HTTP status
      if (result.status === "success") {
        setUploadStatus(
          `Video posted to Twitter successfully! Post ID: ${result.id}`
        );
      } else if (result.status === "error") {
        // Handle Ayrshare-specific errors with user-friendly messages
        const error = result.errors?.[0];
        let errorMessage = "Unknown error";

        if (error) {
          switch (error.code) {
            case 156:
              errorMessage =
                "Twitter account not connected to Ayrshare. Please connect your Twitter account in the Ayrshare dashboard first.";
              break;
            case 110:
              errorMessage =
                "Duplicate post detected. Please try a different message.";
              break;
            case 107:
              errorMessage =
                "Facebook error: This status is identical to your last post. Try posting something different.";
              break;
            default:
              errorMessage = error.message || "Unknown error";
          }
        }

        setUploadStatus(`Twitter posting failed: ${errorMessage}`);

        // Log detailed error for debugging
        console.log("Ayrshare error details:", result);
      } else {
        // Handle unexpected response format
        setUploadStatus(`Twitter posting failed: Unexpected response format`);
        console.log("Unexpected response:", result);
      }
    } catch (error) {
      console.error("Twitter posting error:", error);
      setUploadStatus(
        `Twitter posting failed: ${
          error instanceof Error ? error.message : "Network error"
        }`
      );
    } finally {
      setPostingToTwitter(null);
    }
  };

  const handleUpload = async () => {
    const selectedSource =
      VIDEO_SOURCES[selectedSourceType as keyof typeof VIDEO_SOURCES];

    if (selectedSource.type === "upload" && !selectedFile) {
      setUploadStatus("Please select a video file first.");
      return;
    }

    if (selectedSource.type === "stream" && !streamUrl.trim()) {
      setUploadStatus("Please enter a valid URL for the streaming source.");
      return;
    }

    // Check rate limits
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      setUploadStatus(`Upload blocked: ${rateLimitCheck.message}`);
      return;
    }

    setUploading(true);

    // Show immediate upload confirmation
    if (selectedSource.type === "upload") {
      setUploadStatus(
        "Video uploaded successfully! Video clipping in process..."
      );
    } else {
      setUploadStatus(
        "Streaming source submitted! Video clipping in process..."
      );
    }

    try {
      // Create FormData with the appropriate data
      const formData = new FormData();

      if (selectedSource.type === "upload") {
        formData.append("vid", selectedFile!); // Using "vid" as the key as specified
        formData.append("sourceType", selectedSourceType.toString()); // Send actual source type for upload sources
      } else {
        formData.append("url", streamUrl.trim()); // Add URL for streaming sources
        formData.append("sourceType", selectedSourceType.toString()); // Send actual source type for streaming
      }

      // Send to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();

        // Update status based on response
        if (result && Array.isArray(result) && result.length > 0) {
          setUploadStatus(
            selectedSource.type === "upload"
              ? "Video processing completed successfully!"
              : "Streaming source processing completed successfully!"
          );
        } else {
          setUploadStatus(
            selectedSource.type === "upload"
              ? "Video uploaded and processing initiated!"
              : "Streaming source submitted and processing initiated!"
          );
        }

        // Update rate limit counters
        updateRateLimit();

        // Add the uploaded project to the list
        if (result && Array.isArray(result)) {
          const newProjects = result.map((project: UploadedProject) => ({
            id: project.id,
            name: project.name,
            mimeType: project.mimeType,
            size: project.size,
            webContentLink: project.webContentLink,
            webViewLink: project.webViewLink,
            createdTime: project.createdTime,
            modifiedTime: project.modifiedTime,
            thumbnailVersion: project.thumbnailVersion,
            hasThumbnail: project.hasThumbnail,
            sourceType: selectedSourceType, // Use actual source type for all sources
            url:
              selectedSource.type === "stream" ? streamUrl.trim() : undefined, // Add URL for streaming sources
            projectId: response.headers.get("x-project-id") || undefined, // Extract projectId from headers
          }));

          setUploadedProjects((prev) => [...newProjects, ...prev]);
        }

        // Reset form
        setSelectedFile(null);
        setStreamUrl("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error(`Upload failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus(
        `Processing failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      setUploadStatus("");
    } else if (file) {
      setUploadStatus("Please select a valid video file.");
      setSelectedFile(null);
    }
  };

  const formatFileSize = (bytes: string | number) => {
    const numBytes = typeof bytes === "string" ? parseInt(bytes) : bytes;
    if (numBytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(numBytes) / Math.log(k));
    return parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProjectIcon = (mimeType: string) => {
    if (mimeType.includes("video")) return <FileVideo className="h-5 w-5" />;
    return <FileVideo className="h-5 w-5" />;
  };

  const getSourceTypeInfo = (sourceType: number) => {
    return (
      VIDEO_SOURCES[sourceType as keyof typeof VIDEO_SOURCES] ||
      VIDEO_SOURCES[1]
    );
  };

  // Load uploaded projects on component mount
  useEffect(() => {
    // This would typically call an API to load existing projects
    // For now, we'll just initialize with an empty array
  }, []);

  return (
    <div className="space-y-6">
      {/* Video Upload Form */}
      <Card className="border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileVideo className="h-5 w-5" />
            Video Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File/URL Preview */}
          {VIDEO_SOURCES[selectedSourceType as keyof typeof VIDEO_SOURCES]
            ?.type === "upload" && selectedFile ? (
            <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--muted)]">
              <div className="flex items-center gap-2">
                <FileVideo className="h-4 w-4 text-[var(--muted-foreground)]" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  ({formatFileSize(selectedFile.size)})
                </span>
              </div>
            </div>
          ) : VIDEO_SOURCES[selectedSourceType as keyof typeof VIDEO_SOURCES]
              ?.type === "stream" && streamUrl.trim() ? (
            <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--muted)]">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[var(--muted-foreground)]" />
                <span className="text-sm font-medium">Streaming URL</span>
                <span className="text-xs text-[var(--muted-foreground)] truncate">
                  {streamUrl}
                </span>
              </div>
            </div>
          ) : null}

          {/* Source Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="source-type">Video Source Type</Label>
            <select
              id="source-type"
              value={selectedSourceType}
              onChange={(e) => {
                setSelectedSourceType(Number(e.target.value));
                setSelectedFile(null);
                setStreamUrl("");
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="w-full p-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)]"
            >
              {Object.entries(VIDEO_SOURCES).map(([key, source]) => (
                <option key={key} value={key}>
                  {source.icon} {source.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Input Fields */}
          {VIDEO_SOURCES[selectedSourceType as keyof typeof VIDEO_SOURCES]
            ?.type === "upload" ? (
            <div className="space-y-2">
              <Label htmlFor="video-file">Video File</Label>
              <Input
                id="video-file"
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="cursor-pointer"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="stream-url">Streaming Source URL</Label>
              <Input
                id="stream-url"
                type="url"
                placeholder="Enter video URL (YouTube, Google Drive, etc.)"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {/* Rate Limit Display */}
          <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--muted)]">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Minute: {rateLimitState.minuteCount}/{RATE_LIMITS.perMinute}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Hour: {rateLimitState.hourCount}/{RATE_LIMITS.perHour}
                </span>
              </div>
              {rateLimitState.minuteCount >= RATE_LIMITS.perMinute ||
              rateLimitState.hourCount >= RATE_LIMITS.perHour ? (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  Rate Limited
                </div>
              ) : (
                <div className="flex items-center gap-1 text-green-600">
                  <Clock className="h-4 w-4" />
                  Available
                </div>
              )}
            </div>
          </div>

          {uploadStatus && (
            <div
              className={`text-sm p-3 rounded-lg ${
                uploadStatus.includes("successfully")
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : uploadStatus.includes("failed") ||
                    uploadStatus.includes("blocked") ||
                    uploadStatus.includes("processing")
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : uploadStatus.includes("Streaming source submitted")
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {uploadStatus}
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={
              (VIDEO_SOURCES[selectedSourceType as keyof typeof VIDEO_SOURCES]
                ?.type === "upload" &&
                !selectedFile) ||
              (VIDEO_SOURCES[selectedSourceType as keyof typeof VIDEO_SOURCES]
                ?.type === "stream" &&
                !streamUrl.trim())
            }
            className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
          >
            <Upload className="h-4 w-4 mr-2" />
            {VIDEO_SOURCES[selectedSourceType as keyof typeof VIDEO_SOURCES]
              ?.type === "upload"
              ? "Upload Video"
              : "Process Streaming Source"}
          </Button>
        </CardContent>
      </Card>

      {/* Uploaded Projects Section */}
      {uploadedProjects.length > 0 && (
        <div className="space-y-4">
          {/* Twitter Connection Status */}
          {!isTwitterLinked ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div className="text-sm text-yellow-800">
                  <strong>Twitter Not Connected:</strong> To post videos to
                  Twitter, you need to connect your Twitter account to Ayrshare
                  first. Use the <strong>SSO Generator</strong> tab to create a
                  connection link.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="text-sm text-green-800">
                  <strong>Twitter Connected:</strong> You can now post videos
                  directly to Twitter using the buttons below.
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Uploaded Projects</h3>
            <div className="text-sm text-[var(--muted-foreground)]">
              Total: {uploadedProjects.length}
            </div>
          </div>

          <div className="space-y-3">
            {uploadedProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg border border-[var(--border)] p-4 bg-[var(--card)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getProjectIcon(project.mimeType)}
                      <span className="font-medium">{project.name}</span>
                      {project.projectId && (
                        <Badge variant="secondary" className="text-xs">
                          Project ID: {project.projectId}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)] mt-1">
                      <span>Size: {formatFileSize(project.size)}</span>
                      <span>Type: {project.mimeType}</span>
                      <span>
                        Created:{" "}
                        {new Date(project.createdTime).toLocaleDateString()}
                      </span>
                    </div>
                    {project.url && (
                      <div className="text-sm text-[var(--muted-foreground)] mt-1">
                        Source URL: {project.url}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(project.webViewLink, "_blank")}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(project.webContentLink, "_blank")
                      }
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => postToTwitter(project)}
                      disabled={
                        postingToTwitter === project.id || !isTwitterLinked
                      }
                      title={
                        !isTwitterLinked
                          ? "Twitter account not connected to Ayrshare"
                          : "Post video to Twitter"
                      }
                    >
                      {postingToTwitter === project.id ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Share2 className="h-4 w-4 mr-1" />
                      )}
                      {!isTwitterLinked
                        ? "Twitter Not Linked"
                        : "Post to Twitter"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
