"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ayrshareAPI, type UserProfileDetails } from "@/lib/ayrshare-api";
import {
  Activity,
  Calendar,
  ExternalLink,
  Globe,
  Mail,
  MessageCircle,
  RefreshCw,
  Smartphone,
  TrendingUp,
  User,
  Users,
  Verified,
} from "lucide-react";
import { useEffect, useState } from "react";

interface UserProfileDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileRefId: string;
  profileTitle: string;
}

const getPlatformIcon = (platform: string) => {
  const iconProps = "h-4 w-4";

  switch (platform.toLowerCase()) {
    case "instagram":
      return (
        <div
          className={`${iconProps} bg-gradient-to-br from-purple-500 to-pink-500 rounded`}
        />
      );
    case "twitter":
      return <div className={`${iconProps} bg-blue-400 rounded`} />;
    case "facebook":
      return <div className={`${iconProps} bg-blue-600 rounded`} />;
    case "linkedin":
      return <div className={`${iconProps} bg-blue-700 rounded`} />;
    case "youtube":
      return <div className={`${iconProps} bg-red-600 rounded`} />;
    case "tiktok":
      return <div className={`${iconProps} bg-black rounded`} />;
    case "pinterest":
      return <div className={`${iconProps} bg-red-500 rounded`} />;
    case "snapchat":
      return <div className={`${iconProps} bg-yellow-400 rounded`} />;
    case "reddit":
      return <div className={`${iconProps} bg-orange-500 rounded`} />;
    case "telegram":
      return <div className={`${iconProps} bg-blue-500 rounded`} />;
    case "threads":
      return <div className={`${iconProps} bg-black rounded`} />;
    case "bluesky":
      return <div className={`${iconProps} bg-blue-300 rounded`} />;
    case "gmb":
      return <div className={`${iconProps} bg-green-500 rounded`} />;
    default:
      return <Globe className={iconProps} />;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatUnixTimestamp = (seconds: number, nanoseconds: number) => {
  const timestamp = seconds * 1000 + nanoseconds / 1000000;
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function UserProfileDetailsModal({
  isOpen,
  onClose,
  profileRefId,
  profileTitle,
}: UserProfileDetailsModalProps) {
  const [userDetails, setUserDetails] = useState<UserProfileDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to get detailed user information
      const details = await ayrshareAPI.getUserDetails(profileRefId, {
        instagramDetails: true,
      });
      setUserDetails(details);
    } catch (err) {
      // If we can't get detailed user info, create a basic profile object
      // with the information we already have from the profiles list
      const basicProfile: UserProfileDetails = {
        refId: profileRefId,
        title: profileTitle,
        created: {
          _seconds: Math.floor(Date.now() / 1000),
          _nanoseconds: 0,
          utc: new Date().toISOString(),
        },
        lastUpdated: new Date().toISOString(),
        nextUpdate: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
      };

      setUserDetails(basicProfile);

      // Show a warning that we're showing limited information
      setError(
        "Note: Showing limited profile information. Detailed social account data requires Profile-Key access."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && profileRefId) {
      fetchUserDetails();
    }
  }, [isOpen, profileRefId]);

  const handleClose = () => {
    setUserDetails(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {profileTitle} - Profile Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about the user profile and connected social
            accounts. Note: Full social account details require Profile-Key
            access.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading profile details...</span>
          </div>
        )}

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-yellow-800 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUserDetails}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {userDetails && (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Title:</span>
                      <span className="text-sm">
                        {userDetails.title || "N/A"}
                      </span>
                    </div>

                    {userDetails.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Email:</span>
                        <span className="text-sm">{userDetails.email}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Created:</span>
                      <span className="text-sm">
                        {formatUnixTimestamp(
                          userDetails.created._seconds,
                          userDetails.created._nanoseconds
                        )}
                      </span>
                    </div>

                    {userDetails.lastApiCall && (
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Last API Call:
                        </span>
                        <span className="text-sm">
                          {formatDate(userDetails.lastApiCall)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {userDetails.monthlyPostCount !== undefined && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Monthly Posts:
                        </span>
                        <span className="text-sm">
                          {userDetails.monthlyPostCount}
                          {userDetails.monthlyPostQuota &&
                            ` / ${userDetails.monthlyPostQuota}`}
                        </span>
                      </div>
                    )}

                    {userDetails.messagingEnabled !== undefined && (
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Messaging:</span>
                        <Badge
                          variant={
                            userDetails.messagingEnabled
                              ? "default"
                              : "secondary"
                          }
                        >
                          {userDetails.messagingEnabled
                            ? "Enabled"
                            : "Disabled"}
                        </Badge>
                      </div>
                    )}

                    {userDetails.messagingConversationMonthlyCount !==
                      undefined && (
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Monthly Conversations:
                        </span>
                        <span className="text-sm">
                          {userDetails.messagingConversationMonthlyCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Connected Social Accounts */}
              {userDetails.activeSocialAccounts &&
                userDetails.activeSocialAccounts.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Connected Social Accounts (
                      {userDetails.activeSocialAccounts.length})
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {userDetails.activeSocialAccounts.map((platform) => (
                        <Badge
                          key={platform}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          {getPlatformIcon(platform)}
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {/* Profile Reference Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Reference
                </h3>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Reference ID:</span>
                      <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">
                        {userDetails.refId}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <p className="text-muted-foreground text-xs mt-2">
                      This reference ID can be used for API operations and
                      profile management. To access detailed social account
                      information, you need the Profile-Key that was provided
                      when the profile was created.
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Social Account Information */}
              {userDetails.displayNames &&
                userDetails.displayNames.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Social Account Details
                    </h3>

                    <div className="grid gap-4">
                      {userDetails.displayNames.map((account, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getPlatformIcon(account.platform)}
                              <div>
                                <h4 className="font-medium">
                                  {account.displayName}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  @{account.username || account.id}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {account.verifiedType &&
                                account.verifiedType !== "none" && (
                                  <Badge
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    <Verified className="h-3 w-3" />
                                    {account.verifiedType}
                                  </Badge>
                                )}

                              {account.messagingActive && (
                                <Badge variant="outline">
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  Messaging
                                </Badge>
                              )}
                            </div>
                          </div>

                          {account.description && (
                            <p className="text-sm text-muted-foreground">
                              {account.description}
                            </p>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {account.type && (
                              <div>
                                <span className="font-medium">Type:</span>{" "}
                                {account.type}
                              </div>
                            )}

                            {account.usedQuota !== undefined && (
                              <div>
                                <span className="font-medium">Used Quota:</span>{" "}
                                {account.usedQuota}/50
                              </div>
                            )}

                            {account.subscriptionType && (
                              <div>
                                <span className="font-medium">
                                  Subscription:
                                </span>{" "}
                                {account.subscriptionType}
                              </div>
                            )}

                            {account.refreshDaysRemaining !== undefined && (
                              <div>
                                <span className="font-medium">
                                  Refresh Required:
                                </span>{" "}
                                {account.refreshDaysRemaining} days
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              Connected:
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(account.created)}
                            </span>

                            {account.profileUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(account.profileUrl, "_blank")
                                }
                                className="ml-auto"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View Profile
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Additional Information */}
              {userDetails.lastUpdated && (
                <div className="text-xs text-muted-foreground text-center pt-4 border-t">
                  Last updated: {formatDate(userDetails.lastUpdated)}
                  {userDetails.nextUpdate && (
                    <span>
                      {" "}
                      • Next update: {formatDate(userDetails.nextUpdate)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
