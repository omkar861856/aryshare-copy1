"use client";

import { useProfile } from "@/contexts/profile-context";
import { UserProfileDetails } from "@/lib/ayrshare-api";

export interface UnifiedProfileData {
  // Basic profile info
  profile: UserProfileDetails | null;
  profileId: string | null;
  hasProfile: boolean;

  // Status
  isLoading: boolean;
  error: string | null;

  // Computed values for consistent display
  displayName: string;
  status: "active" | "inactive" | "suspended" | "none";
  statusColor: string;
  statusIcon: string;

  // Social accounts
  socialAccounts: {
    total: number;
    active: number;
    platforms: string[];
    connectedAccounts: Array<{
      platform: string;
      username?: string;
      isActive: boolean;
      type?: string;
    }>;
  };

  // Usage metrics
  usage: {
    monthlyPosts: number;
    monthlyQuota: number;
    remainingPosts: number;
    usagePercentage: number;
    isUnlimited: boolean;
  };

  // Actions
  actions: {
    refresh: () => Promise<void>;
    create: () => Promise<string | null>;
    clear: () => void;
  };
}

export function useUnifiedProfile(): UnifiedProfileData {
  const {
    profile,
    profileId,
    hasProfile,
    isLoading,
    error,
    refreshProfile,
    createProfile,
    clearProfile,
    profileMetadata,
  } = useProfile();

  // Computed display name
  const displayName = profile?.title || profile?.email || "User Profile";

  // Computed status
  const status =
    profile?.suspended === true
      ? "suspended"
      : profileMetadata.isActive
      ? "active"
      : hasProfile
      ? "inactive"
      : "none";

  const statusColor = {
    active: "text-green-600",
    inactive: "text-amber-600",
    suspended: "text-red-600",
    none: "text-gray-600",
  }[status];

  const statusIcon = {
    active: "✅",
    inactive: "⚠️",
    suspended: "🚫",
    none: "❓",
  }[status];

  // Computed social accounts data
  const socialAccounts = {
    total: profileMetadata.socialAccountsCount,
    active:
      profile?.activeSocialAccounts?.filter((acc) => {
        const details = profile?.displayNames?.find((d) => d.platform === acc);
        return details?.messagingActive || false;
      }).length || 0,
    platforms: profile?.activeSocialAccounts || [],
    connectedAccounts: (profile?.activeSocialAccounts || []).map((platform) => {
      const details = profile?.displayNames?.find(
        (d) => d.platform === platform
      );
      return {
        platform,
        username: details?.username,
        isActive: details?.messagingActive || false,
        type: details?.type,
      };
    }),
  };

  // Computed usage metrics
  const usage = {
    monthlyPosts: profileMetadata.monthlyUsage.posts,
    monthlyQuota: profileMetadata.monthlyUsage.quota,
    remainingPosts: profileMetadata.monthlyUsage.remaining,
    usagePercentage:
      profileMetadata.monthlyUsage.quota > 0
        ? (profileMetadata.monthlyUsage.posts /
            profileMetadata.monthlyUsage.quota) *
          100
        : 0,
    isUnlimited: profileMetadata.monthlyUsage.quota === 0,
  };

  return {
    profile,
    profileId,
    hasProfile,
    isLoading,
    error,
    displayName,
    status,
    statusColor,
    statusIcon,
    socialAccounts,
    usage,
    actions: {
      refresh: refreshProfile,
      create: createProfile,
      clear: clearProfile,
    },
  };
}
