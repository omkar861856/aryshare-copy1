export interface AyrshareUserProfile {
  key: string;
  title: string;
  email?: string;
  activeSocialAccounts?: string[];
  created?: string;
}

export interface PostResponse {
  id: string;
  status: string;
  message?: string;
}

export interface CreateProfileResponse {
  key: string;
  title: string;
  status: string;
}

/**
 * Create or get an Ayrshare user profile
 * Call this once per end-user, store the returned `profileKey` in your DB
 */
export async function ensureAyrProfile(
  userId: string,
  userEmail: string
): Promise<string> {
  try {
    // First, check if user already has a profile in your DB
    // This is a placeholder - replace with your actual DB logic
    // const existing = await db.user.findUnique({ where: { id: userId } });
    // if (existing?.ayrProfileKey) return existing.ayrProfileKey;

    // Create new profile
    const response = await fetch("/api/ayrshare/profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `User ${userEmail}`,
        email: userEmail,
      }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      console.error("Create profile API error:", errorData);

      // Create a more descriptive error
      let errorMessage = "Create profile failed";
      if (errorData.details) {
        errorMessage += `: ${errorData.details}`;
      } else if (errorData.message) {
        errorMessage += `: ${errorData.message}`;
      } else if (errorData.error) {
        errorMessage += `: ${errorData.error}`;
      } else if (typeof errorData === "string") {
        errorMessage += `: ${errorData}`;
      } else {
        errorMessage += `: ${JSON.stringify(errorData)}`;
      }

      throw new Error(errorMessage);
    }

    const data: CreateProfileResponse = await response.json();
    const profileKey = data.key;

    // Store the profileKey in your DB
    // await db.user.update({
    //   where: { id: userId },
    //   data: { ayrProfileKey: profileKey }
    // });

    return profileKey;
  } catch (error) {
    console.error("Error ensuring Ayrshare profile:", error);
    throw error;
  }
}

/**
 * Get user profile details from Ayrshare
 */
export async function getAyrProfile(
  profileKey: string
): Promise<AyrshareUserProfile> {
  try {
    const response = await fetch(`/api/ayrshare/user?profileKey=${profileKey}`);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      console.error("Get profile API error:", errorData);

      // Create a more descriptive error
      let errorMessage = "Get profile failed";
      if (errorData.details) {
        errorMessage += `: ${errorData.details}`;
      } else if (errorData.message) {
        errorMessage += `: ${errorData.message}`;
      } else if (errorData.error) {
        errorMessage += `: ${errorData.error}`;
      } else if (typeof errorData === "string") {
        errorMessage += `: ${errorData}`;
      } else {
        errorMessage += `: ${JSON.stringify(errorData)}`;
      }

      throw new Error(errorMessage);
    }

    const data: AyrshareUserProfile = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting Ayrshare profile:", error);
    throw error;
  }
}

/**
 * Post content on behalf of a user
 */
export async function postToSocialMedia(
  profileKey: string,
  post: string,
  platforms: string[] = ["twitter", "facebook", "instagram", "linkedin"]
): Promise<PostResponse> {
  try {
    const response = await fetch("/api/ayrshare/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profileKey,
        post,
        platforms,
      }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      console.error("Post API error:", errorData);

      // Create a more descriptive error
      let errorMessage = "Post failed";
      if (errorData.details) {
        errorMessage += `: ${errorData.details}`;
      } else if (errorData.message) {
        errorMessage += `: ${errorData.message}`;
      } else if (errorData.error) {
        errorMessage += `: ${errorData.error}`;
      } else if (typeof errorData === "string") {
        errorMessage += `: ${errorData}`;
      } else {
        errorMessage += `: ${JSON.stringify(errorData)}`;
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error posting to social media:", error);
    throw error;
  }
}

/**
 * Generate SSO URL for connecting social accounts
 */
export function generateSSOUrl(profileKey: string): string {
  return `/api/ayrshare/sso?profileKey=${profileKey}`;
}

/**
 * Test posting functionality with a random post
 */
export async function testRandomPost(
  profileKey: string
): Promise<PostResponse> {
  try {
    const response = await fetch("/api/ayrshare/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profileKey,
        platforms: ["twitter"],
        text: `Test post from Ayrshare integration - ${new Date().toISOString()}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.details || errorData.error || `HTTP ${response.status}`
      );
    }

    const data: PostResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error testing post:", error);
    throw error;
  }
}

/**
 * Fetch user profile details from Ayrshare using the authenticated user's Profile-Key
 * @param instagramDetails - Whether to include Instagram-specific details
 * @returns Promise<UserProfileDetails>
 */
export async function fetchUserProfileDetails(
  instagramDetails: boolean = false
): Promise<Record<string, unknown>> {
  const params = new URLSearchParams();
  if (instagramDetails) {
    params.append("instagramDetails", "true");
  }

  const response = await fetch(`/api/ayrshare/user?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.details || errorData.error || `HTTP ${response.status}`
    );
  }

  return response.json();
}
