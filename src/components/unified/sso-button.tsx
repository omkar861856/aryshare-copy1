"use client";

import { Badge } from "@/components/ui/badge";
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
import { useProfile } from "@/contexts/profile-context";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

interface SSOButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showDetails?: boolean;
}

export function SSOButton({
  variant = "default",
  size = "default",
  showDetails = false,
}: SSOButtonProps) {
  const { profile, profileId } = useProfile();
  const [isGenerating, setIsGenerating] = useState(false);
  const [ssoData, setSsoData] = useState<{
    url: string;
    expiresAt: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateSSO = async () => {
    if (!profileId) {
      setError("No profile found. Please create a profile first.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ayrshare/sso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileKey: profileId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || errorData.message || "Failed to generate SSO URL";

        // Handle specific error cases
        if (errorMessage.includes("Private key format error")) {
          throw new Error(
            "SSO configuration error. The private key must include the full RSA key content with BEGIN/END headers."
          );
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSsoData(data);
      console.log("✅ SSO URL generated:", data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate SSO URL";
      setError(errorMessage);
      console.error("❌ SSO generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!ssoData?.url) return;

    try {
      await navigator.clipboard.writeText(ssoData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const openSSO = () => {
    if (ssoData?.url) {
      window.open(ssoData.url, "_blank");
    }
  };

  const formatExpiryTime = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins <= 0) return "Expired";
    if (diffMins < 60) return `${diffMins}m remaining`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ${diffMins % 60}m remaining`;
  };

  if (!profileId) {
    return (
      <Button variant="outline" disabled>
        <AlertCircle className="h-4 w-4 mr-2" />
        No Profile Found
      </Button>
    );
  }

  if (showDetails && ssoData) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <LinkIcon className="h-5 w-5" />
            SSO URL Generated
          </CardTitle>
          <CardDescription className="text-green-800">
            Use this URL to access Ayrshare with your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  SSO Generation Failed
                </span>
              </div>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="ssoUrl">SSO URL</Label>
            <div className="flex gap-2">
              <Input
                id="ssoUrl"
                value={ssoData.url}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Clock className="h-4 w-4" />
              <span>{formatExpiryTime(ssoData.expiresAt)}</span>
            </div>
            <Badge variant="outline" className="text-green-600">
              Active
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button onClick={openSSO} className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open SSO
            </Button>
            <Button
              variant="outline"
              onClick={generateSSO}
              disabled={isGenerating}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`}
              />
              Regenerate
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (ssoData && !showDetails) {
    return (
      <div className="flex gap-2">
        <Button onClick={openSSO} variant={variant} size={size}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Open SSO
        </Button>
        <Button
          variant="outline"
          size={size}
          onClick={generateSSO}
          disabled={isGenerating}
        >
          <RefreshCw
            className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={generateSSO}
      variant={variant}
      size={size}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <LinkIcon className="h-4 w-4 mr-2" />
      )}
      {isGenerating ? "Generating..." : "Generate SSO"}
    </Button>
  );
}
