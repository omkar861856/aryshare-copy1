"use client";

import { UserProfileDetails } from "@/lib/ayrshare-api";
import { useEffect, useState, useCallback } from "react";
import { useCurrentUser } from "./use-current-user";

interface UseAyrshareUserReturn {
  userDetails: UserProfileDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAyrshareUser(
  instagramDetails: boolean = false
): UseAyrshareUserReturn {
  const { currentUser, isLoaded, isSignedIn } = useCurrentUser();
  const [userDetails, setUserDetails] = useState<UserProfileDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = useCallback(async () => {
    console.log("🔍 useAyrshareUser: Starting fetch...");
    console.log("👤 Current user:", currentUser);
    console.log("🔑 User metadata:", currentUser?.metadata);

    if (!currentUser?.metadata?.["Profile-Key"]) {
      const errorMsg = "No Profile-Key found in user metadata";
      console.log("❌", errorMsg);
      setError(errorMsg);
      return;
    }

    console.log("✅ Found Profile-Key:", currentUser.metadata["Profile-Key"]);

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (instagramDetails) {
        params.append("instagramDetails", "true");
      }

      const url = `/api/ayrshare/user?${params.toString()}`;
      console.log("📡 Fetching from:", url);

      // Set the required headers for Ayrshare API
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Profile-Key": currentUser.metadata["Profile-Key"],
      };

      console.log("📤 Request headers:", headers);

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      console.log("📥 Response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("❌ Error response:", errorData);
        throw new Error(
          errorData.details || errorData.error || `HTTP ${response.status}`
        );
      }

      const data = await response.json();
      console.log("✅ Successfully fetched user details:", data);
      setUserDetails(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch user details";
      console.error("❌ Error in fetchUserDetails:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentUser, instagramDetails]);

  useEffect(() => {
    if (isLoaded && isSignedIn && currentUser?.metadata?.["Profile-Key"]) {
      fetchUserDetails();
    } else if (isLoaded && !isSignedIn) {
      setUserDetails(null);
      setError(null);
    }
  }, [
    isLoaded,
    isSignedIn,
    currentUser?.metadata,
    instagramDetails,
    fetchUserDetails,
  ]);

  return {
    userDetails,
    loading,
    error,
    refetch: fetchUserDetails,
  };
}
