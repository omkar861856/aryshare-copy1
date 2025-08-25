"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/contexts/profile-context";
import {
  AnalyticsAPI,
  AnalyticsSummary,
  PLATFORM_NAMES,
  PlatformType,
  getPlatformColor,
  getPlatformIcon,
} from "@/lib/analytics-api";
import {
  AlertCircle,
  BarChart3,
  Clock,
  Download,
  Eye,
  Heart,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

interface PlatformAnalyticsData {
  [platform: string]: AnalyticsSummary;
}

export function AnalyticsDashboard() {
  const { profile } = useProfile();
  const [analyticsData, setAnalyticsData] = useState<PlatformAnalyticsData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("overview");

  const analyticsAPI = new AnalyticsAPI();

  // Get connected platforms from user profile
  const getConnectedPlatforms = useCallback((): string[] => {
    if (!profile) return [];

    const platforms: string[] = [];

    // Check activeSocialAccounts array
    if (
      profile.activeSocialAccounts &&
      Array.isArray(profile.activeSocialAccounts)
    ) {
      profile.activeSocialAccounts.forEach((account: any) => {
        if (account.platform && !platforms.includes(account.platform)) {
          platforms.push(account.platform);
        }
      });
    }

    // Check displayNames array for additional platform info
    if (profile.displayNames && Array.isArray(profile.displayNames)) {
      profile.displayNames.forEach((account: any) => {
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

  // Mock data for demonstration - replace with real API calls
  const getMockAnalyticsData = useCallback((): PlatformAnalyticsData => {
    const mockData: PlatformAnalyticsData = {};

    // Only generate mock data for connected platforms
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
            totalPosts: 2930, // tweetCount
            totalViews: 0, // Not available in social analytics
            totalLikes: 561, // likeCount
            totalComments: 0, // Not available in social analytics
            totalShares: 0, // Not available in social analytics
            totalEngagement: 561,
            averageViews: 0,
            averageLikes: 561,
            averageComments: 0,
            averageShares: 0,
            averageEngagement: 561,
            lastUpdated: new Date().toISOString(),
          };
          break;
        case "linkedin":
          mockData[platform] = {
            platform: "linkedin",
            totalPosts: 0, // Not available in social analytics
            totalViews: 264, // impressionCount
            totalLikes: 6, // likeCount
            totalComments: 12, // commentCount
            totalShares: 3, // shareCount
            totalEngagement: 21, // likeCount + commentCount + shareCount
            averageViews: 264,
            averageLikes: 6,
            averageComments: 12,
            averageShares: 3,
            averageEngagement: 21,
            lastUpdated: new Date().toISOString(),
          };
          break;
        case "tiktok":
          mockData[platform] = {
            platform: "tiktok",
            totalPosts: 18, // videoCountTotal
            totalViews: 1493, // viewCountTotal
            totalLikes: 2, // likeCountTotal
            totalComments: 1807, // commentCountTotal
            totalShares: 4, // shareCountTotal
            totalEngagement: 1813, // likeCountTotal + commentCountTotal + shareCountTotal
            averageViews: 1493,
            averageLikes: 2,
            averageComments: 1807,
            averageShares: 4,
            averageEngagement: 1813,
            lastUpdated: new Date().toISOString(),
          };
          break;
        case "youtube":
          mockData[platform] = {
            platform: "youtube",
            totalPosts: 202, // videoCount
            totalViews: 5, // viewCount
            totalLikes: 3, // likes
            totalComments: 8, // comments
            totalShares: 34, // shares
            totalEngagement: 45, // likes + comments + shares
            averageViews: 5,
            averageLikes: 3,
            averageComments: 8,
            averageShares: 34,
            averageEngagement: 45,
            lastUpdated: new Date().toISOString(),
          };
          break;
        case "pinterest":
          mockData[platform] = {
            platform: "pinterest",
            totalPosts: 64, // board.pinCount
            totalViews: 12231, // impression
            totalLikes: 0, // Not available in social analytics
            totalComments: 0, // Not available in social analytics
            totalShares: 45, // save
            totalEngagement: 54, // engagement
            averageViews: 12231,
            averageLikes: 0,
            averageComments: 0,
            averageShares: 45,
            averageEngagement: 54,
            lastUpdated: new Date().toISOString(),
          };
          break;
        case "reddit":
          mockData[platform] = {
            platform: "reddit",
            totalPosts: 0, // Not available in social analytics
            totalViews: 0, // Not available in social analytics
            totalLikes: 4414, // totalKarma
            totalComments: 0, // Not available in social analytics
            totalShares: 0, // Not available in social analytics
            totalEngagement: 4414,
            averageViews: 0,
            averageLikes: 4414,
            averageComments: 0,
            averageShares: 0,
            averageEngagement: 4414,
            lastUpdated: new Date().toISOString(),
          };
          break;
        case "snapchat":
          mockData[platform] = {
            platform: "snapchat",
            totalPosts: 0, // Not available in social analytics
            totalViews: 879, // views
            totalLikes: 0, // Not available in social analytics
            totalComments: 0, // Not available in social analytics
            totalShares: 36, // shares
            totalEngagement: 156, // interactions
            averageViews: 879,
            averageLikes: 0,
            averageComments: 0,
            averageShares: 36,
            averageEngagement: 156,
            lastUpdated: new Date().toISOString(),
          };
          break;
        case "threads":
          mockData[platform] = {
            platform: "threads",
            totalPosts: 0, // Not available in social analytics
            totalViews: 36721, // views
            totalLikes: 1121, // likes
            totalComments: 196, // replies
            totalShares: 3, // reposts
            totalEngagement: 1320, // likes + replies + reposts
            averageViews: 36721,
            averageLikes: 1121,
            averageComments: 196,
            averageShares: 3,
            averageEngagement: 1320,
            lastUpdated: new Date().toISOString(),
          };
          break;
        case "bluesky":
          mockData[platform] = {
            platform: "bluesky",
            totalPosts: 20, // postsCount
            totalViews: 0, // Not available in social analytics
            totalLikes: 0, // Not available in social analytics
            totalComments: 0, // Not available in social analytics
            totalShares: 0, // Not available in social analytics
            totalEngagement: 0,
            averageViews: 0,
            averageLikes: 0,
            averageComments: 0,
            averageShares: 0,
            averageEngagement: 0,
            lastUpdated: new Date().toISOString(),
          };
          break;
        case "gmb":
          mockData[platform] = {
            platform: "gmb",
            totalPosts: 0, // Not available in social analytics
            totalViews: 12863, // Combined impressions (9675 + 2070 + 153 + 65)
            totalLikes: 0, // Not available in social analytics
            totalComments: 0, // Not available in social analytics
            totalShares: 0, // Not available in social analytics
            totalEngagement: 136, // callClicks + websiteClicks (2 + 134)
            averageViews: 12863,
            averageLikes: 0,
            averageComments: 0,
            averageShares: 0,
            averageEngagement: 136,
            lastUpdated: new Date().toISOString(),
          };
          break;
        default:
          // Generate generic mock data for other platforms
          mockData[platform] = {
            platform: platform,
            totalPosts: Math.floor(Math.random() * 50),
            totalViews: Math.floor(Math.random() * 10000),
            totalLikes: Math.floor(Math.random() * 500),
            totalComments: Math.floor(Math.random() * 100),
            totalShares: Math.floor(Math.random() * 50),
            totalEngagement: Math.floor(Math.random() * 600),
            averageViews: Math.floor(Math.random() * 10000),
            averageLikes: Math.floor(Math.random() * 500),
            averageComments: Math.floor(Math.random() * 100),
            averageShares: Math.floor(Math.random() * 50),
            averageEngagement: Math.floor(Math.random() * 600),
            lastUpdated: new Date().toISOString(),
          };
      }
    });

    return mockData;
  }, [connectedPlatforms]);

  useEffect(() => {
    // Load mock data for connected platforms only
    if (connectedPlatforms.length > 0) {
      setAnalyticsData(getMockAnalyticsData());
    }
  }, [profile, connectedPlatforms, getMockAnalyticsData]);

  const refreshAnalytics = async () => {
    if (!profile || connectedPlatforms.length === 0) {
      setError("No connected social platforms found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would call the real social analytics API for connected platforms only
      // const data = await analyticsAPI.getConnectedPlatformAnalytics(profile);
      // const summaries = analyticsAPI.extractMetrics(data);
      // Convert summaries to the expected format

      // For now, refresh mock data
      setAnalyticsData(getMockAnalyticsData());
      setLoading(false);
    } catch (error) {
      console.error("Error refreshing analytics:", error);
      setError("Failed to refresh analytics");
      setLoading(false);
    }
  };

  const getTotalStats = () => {
    const platforms = Object.values(analyticsData);
    return {
      totalPosts: platforms.reduce((sum, p) => sum + p.totalPosts, 0),
      totalViews: platforms.reduce((sum, p) => sum + p.totalViews, 0),
      totalLikes: platforms.reduce((sum, p) => sum + p.totalLikes, 0),
      totalComments: platforms.reduce((sum, p) => sum + p.totalComments, 0),
      totalShares: platforms.reduce((sum, p) => sum + p.totalShares, 0),
      totalEngagement: platforms.reduce((sum, p) => sum + p.totalEngagement, 0),
    };
  };

  const totalStats = getTotalStats();

  // Show message if no platforms are connected
  if (connectedPlatforms.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            No Social Platforms Connected
          </h2>
          <p className="text-muted-foreground mb-6">
            Connect your social media accounts to see analytics and performance
            data.
          </p>
          <Button asChild>
            <Link href="/profiles">Connect Social Accounts</Link>
          </Button>
        </div>
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    trend = "up",
  }: {
    title: string;
    value: string | number;
    icon: any;
    change?: string;
    trend?: "up" | "down" | "neutral";
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {change && (
          <p
            className={`text-xs flex items-center gap-1 ${
              trend === "up"
                ? "text-green-600"
                : trend === "down"
                ? "text-red-600"
                : "text-muted-foreground"
            }`}
          >
            <TrendingUp
              className={`h-3 w-3 ${trend === "down" ? "rotate-180" : ""}`}
            />
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const PlatformCard = ({
    platform,
    data,
  }: {
    platform: string;
    data: AnalyticsSummary;
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {getPlatformIcon(platform as PlatformType)}
            </span>
            <CardTitle className="text-lg">
              {PLATFORM_NAMES[platform as PlatformType] || platform}
            </CardTitle>
          </div>
          <Badge
            variant="secondary"
            className={getPlatformColor(platform as PlatformType)}
          >
            {data.totalPosts > 0 ? `${data.totalPosts} posts` : "Profile"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {data.totalViews.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {platform === "facebook" ||
              platform === "linkedin" ||
              platform === "gmb"
                ? "Impressions"
                : "Views"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.totalEngagement.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Engagement Rate</span>
            <span className="font-medium">
              {data.totalViews > 0
                ? ((data.totalEngagement / data.totalViews) * 100).toFixed(2)
                : 0}
              %
            </span>
          </div>
          <Progress
            value={
              data.totalViews > 0
                ? (data.totalEngagement / data.totalViews) * 100
                : 0
            }
            className="h-2"
          />
        </div>

        <Separator />

        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <div className="font-semibold text-pink-600">
              {data.averageLikes}
            </div>
            <div className="text-xs text-muted-foreground">
              {platform === "facebook" ? "Page Likes" : "Likes"}
            </div>
          </div>
          <div>
            <div className="font-semibold text-blue-600">
              {data.averageComments}
            </div>
            <div className="text-xs text-muted-foreground">Comments</div>
          </div>
          <div>
            <div className="font-semibold text-green-600">
              {data.averageShares}
            </div>
            <div className="text-xs text-muted-foreground">Shares</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Social Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">
            Monitor your social media profiles and audience demographics across
            {connectedPlatforms.length === 1
              ? " your connected platform"
              : ` your ${connectedPlatforms.length} connected platforms`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={refreshAnalytics}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Posts"
          value={totalStats.totalPosts}
          icon={BarChart3}
          change={`${totalStats.totalPosts > 0 ? "+" : ""}${
            totalStats.totalPosts
          } across platforms`}
        />
        <StatCard
          title="Total Reach"
          value={totalStats.totalViews}
          icon={Eye}
          change={`${
            totalStats.totalViews > 0 ? "+" : ""
          }${totalStats.totalViews.toLocaleString()} impressions`}
        />
        <StatCard
          title="Total Engagement"
          value={totalStats.totalEngagement}
          icon={Heart}
          change={`${
            totalStats.totalEngagement > 0 ? "+" : ""
          }${totalStats.totalEngagement.toLocaleString()} interactions`}
        />
        <StatCard
          title="Connected Platforms"
          value={connectedPlatforms.length}
          icon={Users}
          change={`${connectedPlatforms.length} active platform${
            connectedPlatforms.length !== 1 ? "s" : ""
          }`}
        />
      </div>

      {/* Platform Analytics */}
      <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
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
              {PLATFORM_NAMES[platform as PlatformType] || platform}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {connectedPlatforms.map((platform) => {
              const data = analyticsData[platform];
              if (!data) return null;
              return (
                <PlatformCard key={platform} platform={platform} data={data} />
              );
            })}
          </div>
        </TabsContent>

        {connectedPlatforms.map((platform) => {
          const data = analyticsData[platform];
          if (!data) return null;

          return (
            <TabsContent key={platform} value={platform} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">
                        {getPlatformIcon(platform as PlatformType)}
                      </span>
                      {PLATFORM_NAMES[platform as PlatformType] || platform}{" "}
                      Profile Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">
                          {data.averageViews.toLocaleString()}
                        </div>
                        <div className="text-sm text-blue-600">
                          {platform === "facebook" ||
                          platform === "linkedin" ||
                          platform === "gmb"
                            ? "Total Impressions"
                            : "Total Views"}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600">
                          {data.averageEngagement.toLocaleString()}
                        </div>
                        <div className="text-sm text-green-600">
                          Total Engagement
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Engagement Rate</span>
                        <span className="font-semibold">
                          {data.totalViews > 0
                            ? (
                                (data.totalEngagement / data.totalViews) *
                                100
                              ).toFixed(2)
                            : 0}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          data.totalViews > 0
                            ? (data.totalEngagement / data.totalViews) * 100
                            : 0
                        }
                        className="h-3"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Last updated:{" "}
                          {new Date(data.lastUpdated).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {data.totalPosts > 0
                            ? `Total posts: ${data.totalPosts}`
                            : "Profile analytics only"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>Growth trend: +12% this month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
