import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const AYR_API_KEY = process.env.AYR_API_KEY;
const AYR_API_URL = "https://api.ayrshare.com/api";

export async function GET(req: NextRequest) {
  try {
    console.log("🔍 Fetching Ayrshare user profile...");

    // Get the current authenticated user from Clerk
    const user = await currentUser();
    if (!user) {
      console.log("❌ No authenticated user found");
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    // Get Profile-Key from user metadata
    const profileKey = user.publicMetadata?.["Profile-Key"] as string;
    if (!profileKey) {
      console.log("❌ No Profile-Key found in user metadata");
      return NextResponse.json(
        { error: "No Profile-Key found. Please create a profile first." },
        { status: 404 }
      );
    }

    console.log("✅ Profile-Key found:", profileKey);

    if (!AYR_API_KEY) {
      console.error("❌ AYR_API_KEY environment variable is not set");
      return NextResponse.json(
        { error: "Configuration error: AYR_API_KEY not set" },
        { status: 500 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const instagramDetails = searchParams.get("instagramDetails") === "true";

    // Build the API URL
    let apiUrl = `${AYR_API_URL}/user`;
    if (instagramDetails) {
      apiUrl += "?instagramDetails=true";
    }

    console.log("🌐 Fetching from Ayrshare API:", apiUrl);

    // Fetch user profile from Ayrshare
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AYR_API_KEY}`,
        "Profile-Key": profileKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ Failed to fetch Ayrshare user profile:", errorData);

      // Handle specific error cases
      if (response.status === 403) {
        return NextResponse.json(
          {
            error: "Profile Key Not Found",
            details:
              "The Profile-Key is invalid or has been revoked. Please verify your profile setup.",
            code: 144,
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          error: "Failed to fetch Ayrshare user profile",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const profileData = await response.json();
    console.log("✅ Ayrshare user profile fetched successfully");

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("❌ Error fetching Ayrshare user profile:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
