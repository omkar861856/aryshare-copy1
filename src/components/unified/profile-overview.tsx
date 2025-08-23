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
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/contexts/profile-context";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Plus,
  RefreshCw,
  TrendingUp,
  UserCircle,
  Users,
} from "lucide-react";

interface ProfileOverviewProps {
  showActions?: boolean;
  compact?: boolean;
}

export function ProfileOverview({
  showActions = true,
  // compact = false,
}: ProfileOverviewProps) {
  const {
    profile,
    profileId,
    hasProfile,
    isLoading,
    error,
    profileMetadata,
    refreshProfile,
    createProfile,
  } = useProfile();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading Profile...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Fetching your profile information...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Profile Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          {showActions && (
            <div className="flex gap-2">
              <Button onClick={refreshProfile} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button onClick={createProfile} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!hasProfile && !isLoading) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            No Profile Found
          </CardTitle>
          <CardDescription>
            Create your Ayrshare profile to start managing social media accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showActions && (
            <Button onClick={createProfile} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Profile
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!profile && profileId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Profile Loading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Profile ID found, loading details...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            <div>
              <CardTitle>{profile.title || "User Profile"}</CardTitle>
              <CardDescription>
                {profileMetadata.isActive
                  ? "Active Profile"
                  : "Inactive Profile"}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-xs">
              {profileId?.substring(0, 8)}...
            </Badge>
            {profileMetadata.isActive ? (
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
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Social Accounts
              </span>
            </div>
            <p className="text-2xl font-bold">
              {profileMetadata.socialAccountsCount}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Monthly Posts
              </span>
            </div>
            <p className="text-2xl font-bold">
              {profileMetadata.monthlyUsage.posts}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Quota
              </span>
            </div>
            <p className="text-2xl font-bold">
              {profileMetadata.monthlyUsage.quota === 0
                ? "∞"
                : profileMetadata.monthlyUsage.quota}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Last Updated
              </span>
            </div>
            <p className="text-sm font-medium">
              {profileMetadata.lastUpdated
                ? new Date(profileMetadata.lastUpdated).toLocaleDateString()
                : "Never"}
            </p>
          </div>
        </div>

        {/* Monthly Usage Progress */}
        {profileMetadata.monthlyUsage.quota > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Monthly Usage</span>
              <span className="text-muted-foreground">
                {profileMetadata.monthlyUsage.posts} /{" "}
                {profileMetadata.monthlyUsage.quota}
              </span>
            </div>
            <Progress
              value={
                (profileMetadata.monthlyUsage.posts /
                  profileMetadata.monthlyUsage.quota) *
                100
              }
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {profileMetadata.monthlyUsage.remaining} posts remaining this
              month
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={refreshProfile}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" className="flex-1">
              <Users className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
