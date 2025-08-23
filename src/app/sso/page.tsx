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
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SSOPage() {
  const searchParams = useSearchParams();
  const profileKey = searchParams.get("profileKey");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    // Simulate SSO processing
    const timer = setTimeout(() => {
      if (profileKey) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [profileKey]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <RefreshCw className="h-12 w-12 animate-spin text-blue-600" />
            </div>
            <CardTitle>Processing SSO...</CardTitle>
            <CardDescription>
              Please wait while we authenticate your session
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              This may take a few moments
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle className="text-red-900">SSO Failed</CardTitle>
            <CardDescription className="text-red-800">
              Unable to process your SSO request
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-red-700">
              The SSO link may be invalid or expired
            </p>
            <div className="flex gap-2 justify-center">
              <Button asChild variant="outline">
                <Link href="/profiles">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Profiles
                </Link>
              </Button>
              <Button asChild>
                <Link href="/profiles?tab=overview">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-green-900">SSO Successful!</CardTitle>
          <CardDescription className="text-green-800">
            You have been authenticated successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-green-700">
              Profile Key:{" "}
              <Badge variant="outline" className="font-mono">
                {profileKey}
              </Badge>
            </p>
            <p className="text-sm text-green-700">
              You can now access Ayrshare with your profile credentials
            </p>
          </div>

          <div className="flex gap-2 justify-center">
            <Button asChild variant="outline">
              <Link href="/profiles">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profiles
              </Link>
            </Button>
            <Button asChild>
              <a
                href="https://ayrshare.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to Ayrshare
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
