"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  TestTube,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";

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
  const { currentUser, isLoaded } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [localProfileKey, setLocalProfileKey] = useState<string | undefined>(
    propProfileKey
  );
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const userEmail = propUserEmail || currentUser?.email;
  const user = currentUser;

  const handleTestPost = async () => {
    if (!localProfileKey) {
      alert("Profile key is required to test posting.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ayrshare/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileKey: localProfileKey,
          platforms: ["twitter"],
          text: "This is a test post from the Ayrshare integration! 🚀",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTestResult({
          success: true,
          message: "Test post successful!",
          details: data,
        });
      } else {
        setTestResult({
          success: false,
          message: `Test post failed: ${data.error || response.statusText}`,
          details: data,
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Test post error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!userEmail) {
      alert("User email is required to create a profile.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ayrshare/create-user-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setLocalProfileKey(data.profileKey);
        onProfileCreated?.(data.profileKey);
        setTestResult({
          success: true,
          message: "Profile created successfully!",
          details: data,
        });
      } else {
        setTestResult({
          success: false,
          message: `Profile creation failed: ${
            data.error || response.statusText
          }`,
          details: data,
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Profile creation error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Show error if no user email
  if (!userEmail) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Email Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            User email is required to connect social accounts.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show error if not signed in
  if (!user) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Sign In Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            You must be signed in to connect social accounts.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show success state if profile key exists
  if (localProfileKey) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Profile Connected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-xs">
              {localProfileKey}
            </Badge>
            <Badge variant="outline" className="text-green-600">
              Active
            </Badge>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleTestPost}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              Test Post
            </Button>

            <Button asChild className="w-full" variant="outline">
              <a
                href={`https://app.ayrshare.com/dashboard?profileKey=${localProfileKey}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Ayrshare Dashboard
              </a>
            </Button>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg border ${
                testResult.success
                  ? "border-green-200 bg-green-100 text-green-800"
                  : "border-red-200 bg-red-100 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {testResult.success ? "Success" : "Error"}
                </span>
              </div>
              <p className="text-sm">{testResult.message}</p>
              {testResult.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs">
                    View Details
                  </summary>
                  <pre className="mt-2 text-xs bg-white/50 p-2 rounded overflow-auto">
                    {JSON.stringify(testResult.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show message that profile creation is not available
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-600">
          <AlertCircle className="h-5 w-5" />
          Profile Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-amber-800 mb-4">
          An Ayrshare profile is required to connect social media accounts.
        </p>
        <p className="text-sm text-amber-700 mb-4">
          Create your profile to start managing social media accounts.
        </p>
        <Button onClick={handleCreateProfile} className="w-full">
          <Users className="h-4 w-4 mr-2" />
          Create Ayrshare Profile
        </Button>
      </CardContent>
    </Card>
  );
}
