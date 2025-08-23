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
import {
  AyrshareUserProfile,
  generateSSOUrl,
  testRandomPost,
} from "@/lib/ayrshare-utils";
import { useUser } from "@clerk/nextjs";
import { Link, Settings, Share2, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface ConnectSocialsButtonProps {
  profileKey?: string;
  userEmail?: string;
  onProfileCreated?: (profileKey: string) => void;
  className?: string;
}

export function ConnectSocialsButton({
  profileKey: propProfileKey,
  userEmail: propUserEmail,
  onProfileCreated,
  className,
}: ConnectSocialsButtonProps) {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<AyrshareUserProfile | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [localProfileKey, setLocalProfileKey] = useState<string | null>(null);

  // Get profile key from Clerk metadata or props
  const profileKey =
    localProfileKey ||
    propProfileKey ||
    (user?.unsafeMetadata?.ayrProfileKey as string);
  const userEmail = propUserEmail || user?.primaryEmailAddress?.emailAddress;

  // Sync profile key from Clerk metadata on mount
  useEffect(() => {
    if (user?.unsafeMetadata?.ayrProfileKey && !localProfileKey) {
      setLocalProfileKey(user.unsafeMetadata.ayrProfileKey as string);
      console.log(
        "Profile key synced from Clerk metadata:",
        user.unsafeMetadata.ayrProfileKey
      );
    }
  }, [user, localProfileKey]);

  const handleConnectSocials = () => {
    if (!profileKey) {
      alert("No profile key available. Please create a profile first.");
      return;
    }

    // Show loading state
    setIsLoading(true);

    // Open SSO URL in new tab
    const ssoUrl = generateSSOUrl(profileKey);
    const newWindow = window.open(ssoUrl, "_blank");

    // Reset loading state after a short delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Check if window was blocked
    if (!newWindow) {
      alert(
        "Pop-up blocked! Please allow pop-ups for this site and try again."
      );
      setIsLoading(false);
    }
  };

  const handleTestPost = async () => {
    if (!profileKey) {
      alert("No profile key available. Please create a profile first.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await testRandomPost(profileKey);
      setTestResult(`Test post successful! Post ID: ${result.id}`);
    } catch (error) {
      console.error("Test post error:", error);
      let errorMessage = "Unknown error";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        // Handle API error responses
        if ("details" in error && typeof error.details === "string") {
          errorMessage = error.details;
        } else if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        } else if ("error" in error && typeof error.error === "string") {
          errorMessage = error.error;
        } else {
          errorMessage = JSON.stringify(error);
        }
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      setTestResult(`Test post failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!userEmail) {
      alert("User email is required to create a profile.");
      return;
    }

    if (!user) {
      alert("You must be signed in to create a profile.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ayrshare/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `User ${userEmail}`,
          email: userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create profile: ${response.statusText}`);
      }

      const data = await response.json();
      const newProfileKey = data.key;

      // Store the profile key in Clerk metadata
      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            ayrProfileKey: newProfileKey,
          },
        });
        console.log("Profile key stored in Clerk metadata:", newProfileKey);
      } catch (metadataError) {
        console.error(
          "Failed to store profile key in metadata:",
          metadataError
        );
        // Continue anyway - the profile was created successfully
      }

      // Update local state
      setLocalProfileKey(newProfileKey);
      setProfile({ key: newProfileKey, title: data.title, email: userEmail });
      onProfileCreated?.(newProfileKey);

      alert(`Profile created successfully! Profile Key: ${newProfileKey}`);
    } catch (error) {
      alert(
        `Failed to create profile: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">
              Loading user data...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Please sign in to connect social accounts
            </p>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Connect Social Media Accounts
        </CardTitle>
        <CardDescription>
          Link your social media accounts to post across multiple platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profileKey ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Profile Connected</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {profileKey.slice(0, 8)}...
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleConnectSocials}
                className="flex-1"
                disabled={isLoading}
              >
                <Link className="h-4 w-4 mr-2" />
                Connect Socials
              </Button>

              <Button
                variant="outline"
                onClick={handleTestPost}
                disabled={isLoading}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Test Post
              </Button>

              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const response = await fetch("/api/debug/test-post", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ profileKey }),
                    });
                    const result = await response.json();
                    console.log("Debug test result:", result);
                    if (result.success) {
                      setTestResult(`Debug test successful: ${result.message}`);
                    } else {
                      setTestResult(
                        `Debug test failed: ${result.error} - ${JSON.stringify(
                          result.details
                        )}`
                      );
                    }
                  } catch (error) {
                    console.error("Debug test error:", error);
                    setTestResult(
                      `Debug test error: ${
                        error instanceof Error ? error.message : "Unknown error"
                      }`
                    );
                  }
                }}
                disabled={isLoading}
                className="text-xs"
              >
                Debug
              </Button>
            </div>

            {testResult && (
              <div
                className={`text-sm p-2 rounded ${
                  testResult.includes("successful")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {testResult}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-600">
              <Settings className="h-4 w-4" />
              <span className="text-sm">No profile created yet</span>
            </div>

            <Button
              onClick={handleCreateProfile}
              disabled={isLoading || !userEmail}
              className="w-full"
            >
              <Users className="h-4 w-4 mr-2" />
              {isLoading ? "Creating Profile..." : "Create Ayrshare Profile"}
            </Button>

            {!userEmail && (
              <p className="text-xs text-muted-foreground">
                User email is required to create a profile
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
