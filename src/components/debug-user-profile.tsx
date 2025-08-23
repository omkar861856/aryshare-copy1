"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useState } from "react";

export function DebugUserProfile() {
  const { currentUser, isLoaded, isSignedIn } = useCurrentUser();
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/debug/user-profile");
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      setDebugInfo({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const testUserAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ayrshare/user");
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      setDebugInfo({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Not signed in</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debug User Profile</CardTitle>
        <CardDescription>
          Debug information about the current user and their Ayrshare profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        <div>
          <h3 className="font-medium mb-2">Current User Info</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>ID:</strong> {currentUser?.id}
            </div>
            <div>
              <strong>Email:</strong> {currentUser?.email}
            </div>
            <div>
              <strong>Signed In:</strong> {isSignedIn ? "Yes" : "No"}
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div>
          <h3 className="font-medium mb-2">User Metadata</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Profile-Key:</strong>{" "}
              {currentUser?.metadata?.["Profile-Key"] || "Not set"}
            </div>
            <div>
              <strong>Full metadata:</strong>
            </div>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(currentUser?.metadata, null, 2)}
            </pre>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="flex gap-2">
          <Button onClick={testAPI} disabled={loading} variant="outline">
            Test Debug Endpoint
          </Button>
          <Button onClick={testUserAPI} disabled={loading} variant="outline">
            Test User API
          </Button>
        </div>

        {/* Debug Results */}
        {debugInfo && (
          <div>
            <h3 className="font-medium mb-2">API Response</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        {/* Environment Check */}
        <div>
          <h3 className="font-medium mb-2">Environment Check</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Node Env:</strong> {process.env.NODE_ENV}
            </div>
            <div>
              <strong>Has AYR_API_KEY:</strong>{" "}
              {process.env.AYR_API_KEY ? "Yes" : "No"}
            </div>
            <div>
              <strong>API Key Preview:</strong>{" "}
              {process.env.AYR_API_KEY
                ? `${process.env.AYR_API_KEY.substring(0, 8)}...`
                : "Not set"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
