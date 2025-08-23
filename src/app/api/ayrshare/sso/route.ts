import { ayrshareAPI } from "@/lib/ayrshare-api";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("🔐 Starting SSO URL generation...");

    // Check environment variables
    if (!process.env.AYR_PRIVATE_KEY_B64) {
      console.log("❌ AYR_PRIVATE_KEY_B64 not set");
      return NextResponse.json(
        {
          error: "SSO configuration error",
          details: "AYR_PRIVATE_KEY_B64 environment variable is not set",
        },
        { status: 500 }
      );
    }

    if (!process.env.AYR_DOMAIN) {
      console.log("❌ AYR_DOMAIN not set");
      return NextResponse.json(
        {
          error: "SSO configuration error",
          details: "AYR_DOMAIN environment variable is not set",
        },
        { status: 500 }
      );
    }

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

    // Parse request body
    const body = await req.json();
    const { profileKey } = body;

    if (!profileKey) {
      console.log("❌ No profileKey provided in request");
      return NextResponse.json(
        {
          error: "Bad request",
          details: "profileKey is required",
        },
        { status: 400 }
      );
    }

    console.log("🔑 Generating SSO for profile:", profileKey);

    // Generate SSO URL using Ayrshare API
    const ssoData = await ayrshareAPI.generateSSOUrl(profileKey);

    console.log("✅ SSO URL generated successfully");
    console.log("🔗 URL:", ssoData.url);
    console.log("⏰ Expires:", ssoData.expiresAt);

    return NextResponse.json(ssoData, { status: 200 });
  } catch (error) {
    console.error("❌ Error generating SSO URL:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      name: error instanceof Error ? error.name : "Unknown error type",
    });

    // Handle specific Ayrshare API errors
    if (error instanceof Error) {
      if (error.message.includes("AYR_PRIVATE_KEY_B64")) {
        return NextResponse.json(
          {
            error: "Configuration error",
            details:
              "Private key not configured. Please check your environment variables.",
          },
          { status: 500 }
        );
      }

      if (error.message.includes("AYR_DOMAIN")) {
        return NextResponse.json(
          {
            error: "Configuration error",
            details:
              "Domain not configured. Please check your environment variables.",
          },
          { status: 500 }
        );
      }

      if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        return NextResponse.json(
          {
            error: "Authentication failed",
            details: "The Ayrshare API key is invalid or expired.",
          },
          { status: 401 }
        );
      }

      if (
        error.message.includes("403") ||
        error.message.includes("Forbidden")
      ) {
        return NextResponse.json(
          {
            error: "Access denied",
            details:
              "You don't have permission to generate SSO URLs for this profile.",
          },
          { status: 403 }
        );
      }

      if (
        error.message.includes("404") ||
        error.message.includes("Not Found")
      ) {
        return NextResponse.json(
          {
            error: "Profile not found",
            details: "The specified profile could not be found.",
          },
          { status: 404 }
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
