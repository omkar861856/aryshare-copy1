"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AnalyticsSummary,
  PLATFORM_NAMES,
  PlatformType,
  getPlatformColor,
  getPlatformIcon,
} from "@/lib/analytics-api";

interface AnalyticsWidgetProps {
  platform: PlatformType;
  data: AnalyticsSummary;
  variant?: "compact" | "detailed";
}

export function AnalyticsWidget({
  platform,
  data,
  variant = "compact",
}: AnalyticsWidgetProps) {
  const engagementRate =
    data.totalViews > 0 ? (data.totalEngagement / data.totalViews) * 100 : 0;

  if (variant === "compact") {
    return (
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getPlatformIcon(platform)}</span>
              <CardTitle className="text-sm">
                {PLATFORM_NAMES[platform]}
              </CardTitle>
            </div>
            <Badge variant="secondary" className={getPlatformColor(platform)}>
              {data.totalPosts > 0 ? data.totalPosts : "Profile"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
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
            <div>
              <div className="text-lg font-bold text-green-600">
                {data.totalEngagement.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Engagement</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {engagementRate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Rate</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Engagement Rate</span>
              <span className="font-medium">{engagementRate.toFixed(1)}%</span>
            </div>
            <Progress value={engagementRate} className="h-1.5" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getPlatformIcon(platform)}</span>
            <CardTitle className="text-lg">
              {PLATFORM_NAMES[platform]}
            </CardTitle>
          </div>
          <Badge variant="secondary" className={getPlatformColor(platform)}>
            {data.totalPosts > 0
              ? `${data.totalPosts} posts`
              : "Profile Analytics"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {data.totalViews.toLocaleString()}
            </div>
            <div className="text-xs text-blue-600">
              {platform === "facebook" ||
              platform === "linkedin" ||
              platform === "gmb"
                ? "Total Impressions"
                : "Total Views"}
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {data.totalEngagement.toLocaleString()}
            </div>
            <div className="text-xs text-green-600">Total Engagement</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Engagement Rate</span>
            <span className="font-medium">{engagementRate.toFixed(2)}%</span>
          </div>
          <Progress value={engagementRate} className="h-2" />
        </div>

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

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>
              Updated {new Date(data.lastUpdated).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mini inline analytics display
export function InlineAnalytics({
  platform,
  data,
}: {
  platform: PlatformType;
  data: AnalyticsSummary;
}) {
  const engagementRate =
    data.totalViews > 0 ? (data.totalEngagement / data.totalViews) * 100 : 0;

  return (
    <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-md">
      <span className="text-lg">{getPlatformIcon(platform)}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">
            {PLATFORM_NAMES[platform]}
          </span>
          <Badge variant="outline" className="text-xs">
            {data.totalPosts > 0 ? `${data.totalPosts} posts` : "Profile"}
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="font-semibold text-blue-600">
              {data.totalViews.toLocaleString()}
            </span>
            <div className="text-muted-foreground">
              {platform === "facebook" ||
              platform === "linkedin" ||
              platform === "gmb"
                ? "Impressions"
                : "Views"}
            </div>
          </div>
          <div>
            <span className="font-semibold text-green-600">
              {data.totalEngagement.toLocaleString()}
            </span>
            <div className="text-muted-foreground">Engagement</div>
          </div>
          <div>
            <span className="font-semibold text-purple-600">
              {engagementRate.toFixed(1)}%
            </span>
            <div className="text-muted-foreground">Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
