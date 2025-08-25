"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAyrshareUser } from "@/hooks/use-ayrshare-user";
import {
  Activity,
  AlertCircle,
  Calendar,
  RefreshCw,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { CreateUserProfile } from "./create-user-profile";

export function UserProfileDetails() {
  const { userDetails, loading, error, refetch } = useAyrshareUser();

  if (loading) {
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
    // Check if the error is about no profile found
    if (
      error.includes("No Profile-Key found") ||
      error.includes("User profile not found")
    ) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                No Ayrshare Profile Found
              </CardTitle>
              <CardDescription>
                You need to have an Ayrshare profile to view your details and
                connect social media accounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                An Ayrshare profile is required to access social media
                management features. This profile will be linked to your account
                and used for all future operations.
              </p>
              <p className="text-sm text-amber-600">
                Please contact your administrator to set up your profile.
              </p>
            </CardContent>
          </Card>

          <CreateUserProfile
            onProfileCreated={(refId) => {
              console.log("Profile created with Profile-Key:", refId);
              // The page will refresh automatically after profile creation
            }}
          />
        </div>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Error Loading Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!userDetails) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            No Profile Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No profile data available at this time.
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
            {userDetails.title || "User Profile"}
          </CardTitle>
          <CardDescription>
            Profile ID: {userDetails.refId || "N/A"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <p className="text-sm">
                {userDetails.suspended ? "Suspended" : "Active"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Updated
              </p>
              <p className="text-sm">
                {userDetails.lastUpdated
                  ? new Date(userDetails.lastUpdated).toLocaleDateString()
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
              {userDetails.activeSocialAccounts?.length || 0}
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
              {userDetails.monthlyPostCount || 0}
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
              {userDetails.monthlyPostQuota || 0}
            </div>
            <p className="text-xs text-muted-foreground">Posts allowed</p>
          </CardContent>
        </Card>
      </div>

      {/* Social Accounts */}
      {userDetails.activeSocialAccounts &&
        userDetails.activeSocialAccounts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Connected Social Accounts
              </CardTitle>
              <CardDescription>
                {userDetails.activeSocialAccounts.length} platform
                {userDetails.activeSocialAccounts.length !== 1 ? "s" : ""}{" "}
                connected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userDetails.activeSocialAccounts.map((platform) => {
                  const accountDetails = userDetails.displayNames?.find(
                    (d) => d.platform === platform
                  );
                  const isActive = accountDetails?.messagingActive || false;

                  return (
                    <div
                      key={platform}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <span className="capitalize font-medium">{platform}</span>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isActive ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        <span className="text-sm text-muted-foreground">
                          {isActive ? "Active" : "Inactive"}
                        </span>
                        {accountDetails?.username && (
                          <span className="text-xs text-muted-foreground">
                            @{accountDetails.username}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Profile Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Profile Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={refetch} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Profile
            </Button>
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              View Activity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
