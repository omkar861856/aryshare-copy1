"use client";

import { AnalyticsWidget } from "@/components/analytics/analytics-widget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/contexts/profile-context";
import { AnalyticsSummary, PlatformType } from "@/lib/analytics-api";
import { useUser } from "@clerk/nextjs";
import { AlertCircle, BarChart3, Key, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

export default function ProfilesPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { profile, isLoading, error } = useProfile();
  const [activeTab, setActiveTab] = useState("overview");

  // Get connected platforms from user profile
  const getConnectedPlatforms = useCallback((): string[] => {
    if (!profile) return [];

    const platforms: string[] = [];

    // Check activeSocialAccounts array (these are strings)
    if (
      profile.activeSocialAccounts &&
      Array.isArray(profile.activeSocialAccounts)
    ) {
      profile.activeSocialAccounts.forEach((platform: string) => {
        if (platform && !platforms.includes(platform)) {
          platforms.push(platform);
        }
      });
    }

    // Check displayNames array for additional platform info (these are objects with platform property)
    if (profile.displayNames && Array.isArray(profile.displayNames)) {
      profile.displayNames.forEach((account) => {
        if (account.platform && !platforms.includes(account.platform)) {
          platforms.push(account.platform);
        }
      });
    }

    return platforms;
  }, [profile]);

  const connectedPlatforms = useMemo(
    () => getConnectedPlatforms(),
    [getConnectedPlatforms]
  );

  // Mock analytics data for connected platforms only
  const getMockAnalyticsData = useCallback(() => {
    const mockData: Record<string, AnalyticsSummary> = {};

    connectedPlatforms.forEach((platform) => {
      const normalizedPlatform = platform
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      switch (normalizedPlatform) {
        case "facebook":
          mockData[platform] = {
            platform: "facebook",
            totalPosts: 0, // Not available in social analytics
            totalViews: 160, // pageImpressions
            totalLikes: 587, // fanCount
            totalComments: 0, // Not available in social analytics
            totalShares: 0, // Not available in social analytics
            totalEngagement: 20, // pagePostEngagements
            averageViews: 160,
            averageLikes: 587,
            averageComments: 0,
            averageShares: 0,
            averageEngagement: 20,
            lastUpdated: new Date().toISOString(),
          };
          break;
        case "instagram":
          mockData[platform] = {
            platform: "instagram",
            totalPosts: 266, // mediaCount
            totalViews: 123212, // viewsCount
            totalLikes: 116, // likeCount
            totalComments: 6, // commentsCount
            totalShares: 0, // Not available in social analytics
            totalEngagement: 122, // likeCount + commentsCount
            averageViews: 123212,
            averageLikes: 116,
            averageComments: 6,
            averageShares: 0,
            averageEngagement: 122,
            lastUpdated: new Date().toISOString(),
          };
          break;
        case "twitter":
          mockData[platform] = {
            platform: "twitter",
            totalPosts: 0, // Not available in social analytics
            totalViews: 0, // Not available in social analytics
            totalLikes: 0, // Not available in social analytics
            totalComments: 0, // Not available in social analytics
            totalShares: 0, // Not available in social analytics
            totalEngagement: 0, // Not available in social analytics
            averageViews: 0,
            averageLikes: 0,
            averageComments: 0,
            averageShares: 0,
            averageEngagement: 0,
            lastUpdated: new Date().toISOString(),
          };
          break;
        case "linkedin":
          mockData[platform] = {
            platform: "linkedin",
            totalPosts: 0, // Not available in social analytics
            totalViews: 0, // Not available in social analytics
            totalLikes: 0, // Not available in social analytics
            totalComments: 0, // Not available in social analytics
            totalShares: 0, // Not available in social analytics
            totalEngagement: 0, // Not available in social analytics
            averageViews: 0,
            averageLikes: 0,
            averageComments: 0,
            averageShares: 0,
            averageEngagement: 0,
            lastUpdated: new Date().toISOString(),
          };
          break;
        case "tiktok":
          mockData[platform] = {
            platform: "tiktok",
            totalPosts: 0, // Not available in social analytics
            totalViews: 0, // Not available in social analytics
            totalLikes: 0, // Not available in social analytics
            totalComments: 0, // Not available in social analytics
            totalShares: 0, // Not available in social analytics
            totalEngagement: 0, // Not available in social analytics
            averageViews: 0,
            averageLikes: 0,
            averageComments: 0,
            averageShares: 0,
            averageEngagement: 0,
            lastUpdated: new Date().toISOString(),
          };
          break;
        case "youtube":
          mockData[platform] = {
            platform: "youtube",
            totalPosts: 0, // Not available in social analytics
            totalViews: 0, // Not available in social analytics
            totalLikes: 0, // Not available in social analytics
            totalComments: 0, // Not available in social analytics
            totalShares: 0, // Not available in social analytics
            totalEngagement: 0, // Not available in social analytics
            averageViews: 0,
            averageLikes: 0,
            averageComments: 0,
            averageShares: 0,
            averageEngagement: 0,
            lastUpdated: new Date().toISOString(),
          };
          break;
        default:
          mockData[platform] = {
            platform: platform.toLowerCase(),
            totalPosts: 0,
            totalViews: 0,
            totalLikes: 0,
            totalComments: 0,
            totalShares: 0,
            totalEngagement: 0,
            averageViews: 0,
            averageLikes: 0,
            averageComments: 0,
            averageShares: 0,
            averageEngagement: 0,
            lastUpdated: new Date().toISOString(),
          };
      }
    });

    return mockData;
  }, [connectedPlatforms]);

  const analyticsData = useMemo(
    () => getMockAnalyticsData(),
    [getMockAnalyticsData]
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your profiles and analytics.
          </p>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Profiles</h1>
          <p className="text-muted-foreground">
            Manage your connected social media accounts and view performance
            analytics
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard?tab=analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Full Analytics
          </Link>
        </Button>
      </div>

      {/* Profile Status */}
      {profile ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Profile Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {profile.title || "Untitled Profile"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Profile ID: {profile.refId}
                </p>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {connectedPlatforms.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Connected Platforms
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {profile.monthlyPostCount || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  Posts This Month
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {profile.monthlyApiCalls || 0}
                </div>
                <div className="text-xs text-muted-foreground">API Calls</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {profile.monthlyPostQuota || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  Monthly Quota
                </div>
              </div>
            </div>

            <Separator />

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Quick Actions
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("/content?tab=sso", "_self")}
                  className="flex-1"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Generate SSO
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("/dashboard", "_self")}
                  className="flex-1"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Profile Found</h3>
              <p className="text-muted-foreground mb-4">
                Create a profile to start managing your social media accounts.
              </p>
              <Button asChild>
                <Link href="/dashboard">Create Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connected Platforms Analytics */}
      {connectedPlatforms.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className="grid w-full"
            style={{
              gridTemplateColumns: `repeat(${Math.max(
                2,
                connectedPlatforms.length + 1
              )}, 1fr)`,
            }}
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {connectedPlatforms.map((platform) => (
              <TabsTrigger key={platform} value={platform}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Platform Analytics Preview
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {connectedPlatforms.map((platform) => {
                  const data = analyticsData[platform];
                  if (!data) return null;
                  return (
                    <AnalyticsWidget
                      key={platform}
                      platform={platform as PlatformType}
                      data={data}
                      variant="compact"
                    />
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {connectedPlatforms.map((platform) => {
            const data = analyticsData[platform];
            if (!data) return null;

            return (
              <TabsContent
                key={platform}
                value={platform}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}{" "}
                    Analytics
                  </h2>
                  <AnalyticsWidget
                    platform={platform as PlatformType}
                    data={data}
                    variant="detailed"
                  />
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      ) : (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Social Platforms Connected
              </h3>
              <p className="text-muted-foreground mb-4">
                Connect your social media accounts to see analytics and
                performance data.
              </p>
              <Button asChild>
                <Link href="/profiles">Connect Social Accounts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
