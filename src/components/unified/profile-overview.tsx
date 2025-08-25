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
  AlertCircle,
  Calendar,
  Plus,
  RefreshCw,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

interface ProfileOverviewProps {
  showActions?: boolean;
  compact?: boolean;
}

export function ProfileOverview({
  showActions = true,
}: // compact = false,
ProfileOverviewProps) {
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
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!hasProfile && !isLoading) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            No Profile Found
          </CardTitle>
          <CardDescription>
            You don&apos;t have an Ayrshare profile yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              An Ayrshare profile is required to access social media management
              features.
            </p>
            <p className="text-sm text-muted-foreground">
              Please contact your administrator to set up your profile.
            </p>
            {showActions && (
              <Button onClick={createProfile} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Profile Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Unable to load profile information at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {profile.title || "User Profile"}
          </CardTitle>
          <CardDescription>Profile ID: {profileId || "N/A"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <p className="text-sm">
                {profile.suspended ? "Suspended" : "Active"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Updated
              </p>
              <p className="text-sm">
                {profile.lastUpdated
                  ? new Date(profile.lastUpdated).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Social Accounts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile.activeSocialAccounts?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Connected platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Posts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile.monthlyPostCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">Posts this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Quota</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile.monthlyPostQuota || 0}
            </div>
            <p className="text-xs text-muted-foreground">Posts allowed</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Actions */}
      {showActions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Profile Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={refreshProfile} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
