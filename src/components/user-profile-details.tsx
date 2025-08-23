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
import { useAyrshareUser } from "@/hooks/use-ayrshare-user";
import { AlertCircle, CheckCircle, RefreshCw, XCircle } from "lucide-react";
import { CreateUserProfile } from "./create-user-profile";

export function UserProfileDetails() {
  const { userDetails, loading, error, refetch } = useAyrshareUser();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading Profile Details...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Fetching your Ayrshare profile information...
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
                You need to create an Ayrshare profile to view your details and
                connect social media accounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                An Ayrshare profile is required to access social media
                management features. This profile will be linked to your account
                and used for all future operations.
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
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            No Profile Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No Ayrshare profile found for this user. Please ensure the user has
            been created in Ayrshare.
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
          <CardTitle className="flex items-center justify-between">
            <span>{userDetails.title || "User Profile"}</span>
            <Badge variant="secondary">{userDetails.refId}</Badge>
          </CardTitle>
          <CardDescription>
            Profile created on{" "}
            {new Date(userDetails.created.utc).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userDetails.email && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{userDetails.email}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Monthly Posts
              </p>
              <p className="text-2xl font-bold">
                {userDetails.monthlyPostCount || 0}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Monthly Quota
              </p>
              <p className="text-2xl font-bold">
                {userDetails.monthlyPostQuota || "Unlimited"}
              </p>
            </div>
          </div>

          {userDetails.messagingEnabled && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">Messaging Enabled</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Accounts */}
      {userDetails.activeSocialAccounts &&
        userDetails.activeSocialAccounts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Connected Social Accounts</CardTitle>
              <CardDescription>
                {userDetails.activeSocialAccounts.length} social media accounts
                connected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {userDetails.activeSocialAccounts.map((platform) => (
                  <Badge
                    key={platform}
                    variant="outline"
                    className="capitalize"
                  >
                    {platform}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Display Names */}
      {userDetails.displayNames && userDetails.displayNames.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Social Media Profiles</CardTitle>
            <CardDescription>
              Detailed information about connected social media accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userDetails.displayNames.map((profile, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {profile.platform}
                      </Badge>
                      {profile.username && (
                        <span className="font-medium">@{profile.username}</span>
                      )}
                    </div>
                    {profile.type && (
                      <Badge variant="outline" className="text-xs">
                        {profile.type}
                      </Badge>
                    )}
                  </div>

                  {profile.displayName && (
                    <p className="font-medium">{profile.displayName}</p>
                  )}

                  {profile.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {profile.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    {profile.created && (
                      <span>
                        Linked: {new Date(profile.created).toLocaleDateString()}
                      </span>
                    )}
                    {profile.messagingActive && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Messaging Active
                      </span>
                    )}
                  </div>

                  {profile.profileUrl && (
                    <a
                      href={profile.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                    >
                      View Profile →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {userDetails.monthlyApiCalls || 0}
              </p>
              <p className="text-sm text-muted-foreground">API Calls</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {userDetails.monthlyPostCount || 0}
              </p>
              <p className="text-sm text-muted-foreground">Posts</p>
            </div>
            {userDetails.messagingConversationMonthlyCount !== undefined && (
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {userDetails.messagingConversationMonthlyCount}
                </p>
                <p className="text-sm text-muted-foreground">Conversations</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-2xl font-bold">
                {userDetails.lastApiCall
                  ? new Date(userDetails.lastApiCall).toLocaleDateString()
                  : "Never"}
              </p>
              <p className="text-sm text-muted-foreground">Last API Call</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Profile Data
        </Button>
      </div>
    </div>
  );
}
