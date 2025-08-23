import { ayrshareAPI } from "@/lib/ayrshare-api";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("🔍 Starting user profile fetch...");
    console.log(
      "🔑 Environment check - AYR_API_KEY:",
      process.env.AYR_API_KEY ? "SET" : "NOT SET"
    );
    console.log(
      "🔑 API Key preview:",
      process.env.AYR_API_KEY
        ? `${process.env.AYR_API_KEY.substring(0, 8)}...`
        : "N/A"
    );

    // Get the current authenticated user from Clerk
    const user = await currentUser();
    if (!user) {
      console.log("❌ No authenticated user found");
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    console.log("✅ User authenticated:", user.id);
    console.log("📋 User metadata:", user.publicMetadata);

    // Extract Profile-Key from request headers (preferred) or fall back to Clerk metadata
    const profileKey =
      req.headers.get("Profile-Key") ||
      (user.publicMetadata?.["Profile-Key"] as string);

    if (!profileKey) {
      console.log("❌ No Profile-Key found in headers or user metadata");
      return NextResponse.json(
        {
          error: "User profile not found",
          details:
            "No Profile-Key found in request headers or user metadata. User may not have an Ayrshare profile yet.",
        },
        { status: 404 }
      );
    }

    console.log("🔑 Found Profile-Key:", profileKey);
    console.log(
      "📋 Source:",
      req.headers.get("Profile-Key") ? "Request Header" : "Clerk Metadata"
    );

    // Get query parameters for additional options
    const { searchParams } = new URL(req.url);
    const instagramDetails = searchParams.get("instagramDetails") === "true";

    console.log(
      "📡 Making request to Ayrshare API with Profile-Key:",
      profileKey
    );
    console.log("📊 Instagram details requested:", instagramDetails);
    console.log(
      "🌐 Ayrshare API instance:",
      ayrshareAPI ? "Created" : "Not created"
    );

    // Make request to Ayrshare API using the Profile-Key
    console.log("🔍 About to call ayrshareAPI.getUserDetails with:");
    console.log("  - profileKey:", profileKey);
    console.log("  - params:", { instagramDetails });
    console.log("  - ayrshareAPI instance:", ayrshareAPI);

    const userDetails = await ayrshareAPI.getUserDetails(profileKey, {
      instagramDetails,
    });

    console.log("✅ Successfully fetched user details from Ayrshare");
    console.log("📊 Profile title:", userDetails.title);
    console.log(
      "🔗 Active social accounts:",
      userDetails.activeSocialAccounts?.length || 0
    );

    return NextResponse.json(userDetails, { status: 200 });
  } catch (error) {
    console.error("❌ Error getting user profile details:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      name: error instanceof Error ? error.name : "Unknown error type",
    });

    // Handle specific Ayrshare API errors
    if (error instanceof Error) {
      if (error.message.includes("Profile Key Not Found")) {
        return NextResponse.json(
          {
            error: "Profile not found",
            details:
              "The user's Ayrshare profile could not be found with the provided Profile-Key",
          },
          { status: 404 }
        );
      }

      if (error.message.includes("403")) {
        return NextResponse.json(
          {
            error: "Access denied",
            details:
              "Access to the user profile was denied. Please check your API key and permissions.",
          },
          { status: 403 }
        );
      }

      // Check for specific error patterns
      if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        return NextResponse.json(
          {
            error: "Authentication failed",
            details:
              "The Ayrshare API key is invalid or expired. Please check your configuration.",
          },
          { status: 401 }
        );
      }

      if (
        error.message.includes("500") ||
        error.message.includes("Internal Server Error")
      ) {
        return NextResponse.json(
          {
            error: "Ayrshare API error",
            details:
              "The Ayrshare service is experiencing issues. Please try again later.",
          },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
