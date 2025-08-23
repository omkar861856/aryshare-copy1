"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { UserProfileDetails } from "@/lib/ayrshare-api";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ProfileContextType {
  // Profile data
  profile: UserProfileDetails | null;
  profileId: string | null;

  // Profile status
  hasProfile: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  refreshProfile: () => Promise<void>;
  createProfile: () => Promise<string | null>;
  clearProfile: () => void;

  // Profile metadata
  profileMetadata: {
    isActive: boolean;
    lastUpdated: string | null;
    socialAccountsCount: number;
    monthlyUsage: {
      posts: number;
      quota: number;
      remaining: number;
    };
  };
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoaded, isSignedIn } = useCurrentUser();
  const [profile, setProfile] = useState<UserProfileDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get profile ID from user metadata or profile data
  const profileId =
    (isLoaded && currentUser?.metadata?.["Profile-Key"]) ||
    profile?.refId ||
    null;
  const hasProfile = !!profileId && !!profile;

  // Profile metadata for consistent display across the platform
  const profileMetadata = {
    isActive: !!profile && !(profile.suspended ?? false),
    lastUpdated: profile?.lastUpdated || null,
    socialAccountsCount: profile?.activeSocialAccounts?.length || 0,
    monthlyUsage: {
      posts: profile?.monthlyPostCount || 0,
      quota: profile?.monthlyPostQuota || 0,
      remaining:
        (profile?.monthlyPostQuota || 0) - (profile?.monthlyPostCount || 0),
    },
  };

  // Fetch profile data from Ayrshare
  const fetchProfile = async (profileKey: string) => {
    if (!profileKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ayrshare/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Profile-Key": profileKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || `HTTP ${response.status}`
        );
      }

      const profileData = await response.json();
      setProfile(profileData);
      console.log("✅ Profile loaded:", profileData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch profile";
      setError(errorMessage);
      console.error("❌ Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new profile
  const createProfile = async (): Promise<string | null> => {
    if (!currentUser) return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ayrshare/create-user-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || `HTTP ${response.status}`
        );
      }

      const data = await response.json();
      console.log("✅ Profile created:", data);

      // Refresh the profile data
      if (data.ref_id) {
        await fetchProfile(data.ref_id);
        return data.ref_id;
      }

      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create profile";
      setError(errorMessage);
      console.error("❌ Error creating profile:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (profileId) {
      await fetchProfile(profileId);
    }
  };

  // Clear profile data
  const clearProfile = () => {
    setProfile(null);
    setError(null);
  };

  // Load profile when user changes or profile ID changes
  useEffect(() => {
    if (isLoaded && isSignedIn && profileId) {
      fetchProfile(profileId);
    } else if (isLoaded && !isSignedIn) {
      clearProfile();
    }
  }, [isLoaded, isSignedIn, profileId]);

  const value: ProfileContextType = {
    profile,
    profileId,
    hasProfile,
    isLoading,
    error,
    refreshProfile,
    createProfile,
    clearProfile,
    profileMetadata,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
