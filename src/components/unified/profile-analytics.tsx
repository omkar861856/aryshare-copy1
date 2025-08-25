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
  Activity,
  BarChart3,
  Calendar,
  Eye,
  Heart,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

interface ProfileAnalyticsProps {
  showActions?: boolean;
}

export function ProfileAnalytics({
  showActions = true,
}: ProfileAnalyticsProps) {
  const { profile } = useProfile();

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Profile Analytics
          </CardTitle>
          <CardDescription>
            View performance metrics and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please contact your administrator to set up your profile first.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Mock analytics data - in real app, this would come from Ayrshare API
  const analyticsData = {
    engagement: {
      rate: 4.2,
      change: 12.5,
      trend: "up" as const,
    },
    reach: {
      total: 15420,
      change: -2.1,
      trend: "down" as const,
    },
    impressions: {
      total: 89250,
      change: 8.7,
      trend: "up" as const,
    },
    clicks: {
      total: 3240,
      change: 15.3,
      trend: "up" as const,
    },
  };

  const platformPerformance = [
    { platform: "Instagram", posts: 12, engagement: 5.2, reach: 8900 },
    { platform: "Twitter", posts: 8, engagement: 3.8, reach: 4200 },
    { platform: "LinkedIn", posts: 5, engagement: 2.1, reach: 2300 },
  ];

  const recentActivity = [
    {
      type: "post",
      platform: "Instagram",
      content: "New product launch!",
      time: "2 hours ago",
      engagement: 45,
    },
    {
      type: "post",
      platform: "Twitter",
      content: "Industry insights",
      time: "1 day ago",
      engagement: 23,
    },
    {
      type: "connection",
      platform: "LinkedIn",
      content: "New connection",
      time: "2 days ago",
      engagement: 12,
    },
  ];

  const getTrendIcon = (trend: "up" | "down") => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getTrendColor = (trend: "up" | "down") => {
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">
              Engagement Rate
            </CardTitle>
            <Heart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {analyticsData.engagement.rate}%
            </div>
            <div className="flex items-center gap-1 text-xs">
              {getTrendIcon(analyticsData.engagement.trend)}
              <span className={getTrendColor(analyticsData.engagement.trend)}>
                +{analyticsData.engagement.change}%
              </span>
              <span className="text-blue-700">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">
              Total Reach
            </CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {(analyticsData.reach.total / 1000).toFixed(1)}K
            </div>
            <div className="flex items-center gap-1 text-xs">
              {getTrendIcon(analyticsData.reach.trend)}
              <span className={getTrendColor(analyticsData.reach.trend)}>
                {analyticsData.reach.change > 0 ? "+" : ""}
                {analyticsData.reach.change}%
              </span>
              <span className="text-green-700">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">
              Impressions
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {(analyticsData.impressions.total / 1000).toFixed(1)}K
            </div>
            <div className="flex items-center gap-1 text-xs">
              {getTrendIcon(analyticsData.impressions.trend)}
              <span className={getTrendColor(analyticsData.impressions.trend)}>
                +{analyticsData.impressions.change}%
              </span>
              <span className="text-purple-700">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">
              Click Rate
            </CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {(analyticsData.clicks.total / 1000).toFixed(1)}K
            </div>
            <div className="flex items-center gap-1 text-xs">
              {getTrendIcon(analyticsData.clicks.trend)}
              <span className={getTrendColor(analyticsData.clicks.trend)}>
                +{analyticsData.clicks.change}%
              </span>
              <span className="text-orange-700">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Platform Performance
          </CardTitle>
          <CardDescription>
            Performance metrics across connected social platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platformPerformance.map((platform) => (
              <div
                key={platform.platform}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {platform.platform.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium">{platform.platform}</h4>
                    <p className="text-sm text-muted-foreground">
                      {platform.posts} posts this month
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {platform.engagement}%
                  </div>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {(platform.reach / 1000).toFixed(1)}K
                  </div>
                  <p className="text-sm text-muted-foreground">Reach</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest posts and interactions across platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white text-xs">
                  {activity.type === "post" ? "P" : "C"}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{activity.content}</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.platform}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.time}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm">
                    <Heart className="h-3 w-3" />
                    {activity.engagement}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-3">
          <Button className="flex-1">
            <TrendingUp className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
        </div>
      )}
    </div>
  );
}
