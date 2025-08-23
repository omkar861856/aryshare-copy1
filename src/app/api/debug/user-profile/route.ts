import { getCurrentUserProfileKey } from "@/lib/clerk-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get the current user's Profile-Key from Clerk metadata
    const profileKey = await getCurrentUserProfileKey();

    if (!profileKey) {
      return NextResponse.json(
        {
          error: "No Profile-Key found",
          message:
            "User does not have an Ayrshare profile Profile-Key in their Clerk metadata",
          userMetadata: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profileKey,
      message: "User Profile-Key found successfully",
      note: "Use this Profile-Key to make requests to Ayrshare API with Profile-Key header",
    });
  } catch (error) {
    console.error("Error in debug user profile route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
