"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CheckCircle, Loader2, Plus, UserCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface CreateUserProfileProps {
  onProfileCreated?: (refId: string) => void;
}

export function CreateUserProfile({
  onProfileCreated,
}: CreateUserProfileProps) {
  const { currentUser, isLoaded } = useCurrentUser();
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    ref_id?: string;
    warning?: string;
  } | null>(null);

  const handleCreateProfile = async () => {
    if (!currentUser) return;

    setIsCreating(true);
    setResult(null);

    try {
      const response = await fetch("/api/ayrshare/create-user-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          ref_id: data.ref_id,
          warning: data.warning,
        });

        // Call the callback if provided
        if (data.ref_id && onProfileCreated) {
          onProfileCreated(data.ref_id);
        }

        // Refresh the page to update the user metadata
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to create profile",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // If user already has a Profile-Key, show success state
  if (currentUser?.metadata?.["Profile-Key"]) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Profile Already Exists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono text-xs">
                {currentUser.metadata["Profile-Key"]}
              </Badge>
              <Badge variant="outline" className="text-green-600">
                Active
              </Badge>
            </div>
            <p className="text-green-700">
              You already have an Ayrshare profile. You can now connect social
              media accounts and start posting.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show create profile form
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="h-5 w-5" />
          Create Ayrshare Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Create your Ayrshare profile to start managing social media
            accounts. This profile will be linked to your account and used for
            all future operations.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>• Profile will be created with your name</p>
            <p>• Automatically linked to your account</p>
            <p>• Ready for social media connections</p>
          </div>
        </div>

        {result && (
          <div
            className={`p-3 rounded-lg border ${
              result.success
                ? "border-green-200 bg-green-100 text-green-800"
                : "border-red-200 bg-red-100 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <span className="font-medium">
                {result.success ? "Success" : "Error"}
              </span>
            </div>
            <p className="text-sm">{result.message}</p>
            {result.warning && (
              <p className="text-sm text-amber-700 mt-1">⚠️ {result.warning}</p>
            )}
          </div>
        )}

        <Button
          onClick={handleCreateProfile}
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {isCreating ? "Creating Profile..." : "Create Profile"}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          Profile creation may take a few moments. Please wait...
        </div>
      </CardContent>
    </Card>
  );
}
