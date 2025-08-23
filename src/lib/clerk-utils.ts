import { currentUser } from "@clerk/nextjs/server";

/**
 * Get the current user's Ayrshare Profile-Key from Clerk metadata
 */
export async function getCurrentUserProfileKey(): Promise<string | null> {
  try {
    const user = await currentUser();
    if (!user) return null;

    return (user.publicMetadata?.["Profile-Key"] as string) || null;
  } catch (error) {
    console.error("Error getting user Profile-Key:", error);
    return null;
  }
}

/**
 * Get the current user's Ayrshare profile key from Clerk metadata (legacy function)
 */
export async function getCurrentUserRefId(): Promise<string | null> {
  return getCurrentUserProfileKey();
}

/**
 * Check if the current user has an Ayrshare profile
 */
export async function hasAyrshareProfile(): Promise<boolean> {
  const profileKey = await getCurrentUserProfileKey();
  return !!profileKey;
}

/**
 * Get the current user's email from Clerk
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  try {
    const user = await currentUser();
    if (!user) return null;

    return user.primaryEmailAddress?.emailAddress || null;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
}
