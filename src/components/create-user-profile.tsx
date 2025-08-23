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
import { useCurrentUser } from "@/hooks/use-current-user";
import { AlertCircle, CheckCircle, Loader2, Plus } from "lucide-react";
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
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Profile Already Exists
          </CardTitle>
          <CardDescription className="text-green-700">
            Your Ayrshare profile is already set up and ready to use.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-800">
                Profile ID:
              </span>
              <Badge variant="secondary" className="font-mono text-xs">
                {currentUser.metadata["Profile-Key"]}
              </Badge>
            </div>
            <p className="text-sm text-green-700">
              You can now view your profile details and connect social media
              accounts.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Ayrshare Profile
        </CardTitle>
        <CardDescription>
          Set up your Ayrshare profile to start managing social media accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result ? (
          <>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This will create a new profile in Ayrshare and link it to your
                account.
              </p>
              <div className="text-sm">
                <strong>Profile will be created for:</strong>{" "}
                {currentUser?.firstName} {currentUser?.lastName} (
                {currentUser?.email})
              </div>
            </div>

            <Button
              onClick={handleCreateProfile}
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Profile
                </>
              )}
            </Button>
          </>
        ) : (
          <div
            className={`space-y-3 ${
              result.success ? "text-green-700" : "text-red-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">{result.message}</span>
            </div>

            {result.ref_id && (
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-sm font-medium text-gray-800">
                  Profile ID:
                </div>
                <Badge variant="secondary" className="font-mono text-xs mt-1">
                  {result.ref_id}
                </Badge>
              </div>
            )}

            {result.warning && (
              <div className="bg-yellow-100 p-3 rounded text-yellow-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Warning:</span>
                </div>
                <p className="text-sm mt-1">{result.warning}</p>
              </div>
            )}

            {result.success && (
              <div className="text-sm text-green-600">
                Page will refresh automatically to load your new profile...
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
