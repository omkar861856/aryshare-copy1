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
import { useProfile } from "@/contexts/profile-context";
import {
  AlertCircle,
  CheckCircle,
  Facebook,
  Instagram,
  Link,
  Linkedin,
  Plus,
  RefreshCw,
  Share2,
  Twitter,
  Users,
  Youtube,
} from "lucide-react";

interface SocialAccountsOverviewProps {
  showActions?: boolean;
  compact?: boolean;
}

export function SocialAccountsOverview({
  showActions = true,
  // compact = false,
}: SocialAccountsOverviewProps) {
  const { profile, createProfile } = useProfile();

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Social Accounts
          </CardTitle>
          <CardDescription>No profile data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please create a profile first to view social accounts.
          </p>
          {showActions && (
            <Button onClick={createProfile} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Profile
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const socialAccounts = profile.activeSocialAccounts || [];
  const displayNames = profile.displayNames || [];

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "youtube":
        return <Youtube className="h-4 w-4" />;
      case "tiktok":
        return <Share2 className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  // Get platform color
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "twitter":
        return "bg-blue-500";
      case "facebook":
        return "bg-blue-600";
      case "linkedin":
        return "bg-blue-700";
      case "youtube":
        return "bg-red-600";
      case "tiktok":
        return "bg-gray-800";
      default:
        return "bg-gray-500";
    }
  };

  if (socialAccounts.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            No Social Accounts Connected
          </CardTitle>
          <CardDescription>
            Connect your social media accounts to start posting and managing
            content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              You haven&apos;t connected any social media accounts yet.
            </p>
            {showActions && (
              <Button>
                <Link className="h-4 w-4 mr-2" />
                Connect Accounts
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Connected Social Accounts
            </CardTitle>
            <CardDescription>
              {socialAccounts.length} account
              {socialAccounts.length !== 1 ? "s" : ""} connected
            </CardDescription>
          </div>
          {showActions && (
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add More
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {socialAccounts.map((platform) => {
            const accountDetails = displayNames.find(
              (d) => d.platform === platform
            );
            const isActive = accountDetails?.messagingActive || false;

            return (
              <div
                key={platform}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${getPlatformColor(
                      platform
                    )}`}
                  />
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(platform)}
                    <span className="font-medium capitalize">{platform}</span>
                  </div>
                  {accountDetails?.username && (
                    <span className="text-sm text-muted-foreground">
                      @{accountDetails.username}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isActive ? (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-600">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}

                  {accountDetails?.type && (
                    <Badge variant="secondary" className="text-xs">
                      {accountDetails.type}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {showActions && (
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" className="flex-1">
              <Link className="h-4 w-4 mr-2" />
              Manage Connections
            </Button>
            <Button variant="outline" className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
