"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export interface CurrentUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  metadata?: {
    "Profile-Key"?: string;
    [key: string]: any;
  };
}

export function useCurrentUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setCurrentUser({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        imageUrl: user.imageUrl,
        metadata: user.publicMetadata || {},
      });
    } else if (isLoaded && !isSignedIn) {
      setCurrentUser(null);
    }
  }, [user, isLoaded, isSignedIn]);

  return {
    currentUser,
    isLoaded,
    isSignedIn,
  };
}
