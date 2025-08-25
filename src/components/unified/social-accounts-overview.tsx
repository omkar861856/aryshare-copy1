"use client";

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
  Facebook,
  Instagram,
  Link,
  Linkedin,
  Plus,
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
}: // compact = false,
SocialAccountsOverviewProps) {
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
            Please contact your administrator to set up your profile first.
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
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Connected Social Accounts
          </CardTitle>
          <CardDescription>
            {socialAccounts.length} platform
            {socialAccounts.length !== 1 ? "s" : ""} connected
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Social Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {socialAccounts.map((platform) => {
          const displayName = displayNames.find((d) => d.platform === platform);
          const isActive = displayName?.messagingActive || false;

          return (
            <Card
              key={platform}
              className={`transition-all hover:shadow-md ${
                isActive ? "border-green-200" : "border-gray-200"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-lg ${getPlatformColor(platform)}`}
                    >
                      {getPlatformIcon(platform)}
                    </div>
                    <div>
                      <CardTitle className="text-sm capitalize">
                        {platform}
                      </CardTitle>
                      {displayName?.username && (
                        <CardDescription className="text-xs">
                          @{displayName.username}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Status:</span>
                    <span
                      className={isActive ? "text-green-600" : "text-gray-500"}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {displayName?.type && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{displayName.type}</span>
                    </div>
                  )}
                  {displayName?.created && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Connected:</span>
                      <span className="text-xs">
                        {new Date(displayName.created).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {displayName?.refreshDaysRemaining && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Auth Expires:
                      </span>
                      <span className="text-xs">
                        {displayName.refreshDaysRemaining} days
                      </span>
                    </div>
                  )}
                  {displayName?.usedQuota && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Quota Used:</span>
                      <span className="text-xs">
                        {displayName.usedQuota}/50 posts
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Actions */}
      {showActions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Link className="h-4 w-4 mr-2" />
                Connect More Accounts
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Manage Accounts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
