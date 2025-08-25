"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AnalyticsSummary,
  PLATFORM_NAMES,
  PlatformType,
  getPlatformColor,
  getPlatformIcon,
} from "@/lib/analytics-api";
import { BarChart3, Clock, ExternalLink } from "lucide-react";

interface PlatformAnalyticsProps {
  platform: PlatformType;
  data: AnalyticsSummary;
  showDetails?: boolean;
  compact?: boolean;
  onViewDetails?: () => void;
}

export function PlatformAnalytics({
  platform,
  data,
  showDetails = false,
  compact = false,
  onViewDetails,
}: PlatformAnalyticsProps) {
  const engagementRate =
    data.totalPosts > 0 ? (data.totalEngagement / data.totalViews) * 100 : 0;

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getPlatformIcon(platform)}</span>
              <CardTitle className="text-base">
                {PLATFORM_NAMES[platform]}
              </CardTitle>
            </div>
            <Badge variant="secondary" className={getPlatformColor(platform)}>
              {data.totalPosts} posts
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {data.totalViews.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Views</div>
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

          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onViewDetails}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Details
            </Button>
          )}
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
            {data.totalPosts} posts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {data.totalViews.toLocaleString()}
            </div>
            <div className="text-xs text-blue-600">Total Views</div>
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

        <Separator />

        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <div className="font-semibold text-pink-600">
              {data.averageLikes}
            </div>
            <div className="text-xs text-muted-foreground">Avg Likes</div>
          </div>
          <div>
            <div className="font-semibold text-blue-600">
              {data.averageComments}
            </div>
            <div className="text-xs text-muted-foreground">Avg Comments</div>
          </div>
          <div>
            <div className="font-semibold text-green-600">
              {data.averageShares}
            </div>
            <div className="text-xs text-muted-foreground">Avg Shares</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              Updated {new Date(data.lastUpdated).toLocaleDateString()}
            </span>
          </div>
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={onViewDetails}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
