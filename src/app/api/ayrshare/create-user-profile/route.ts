import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const AYR_API_KEY = process.env.AYR_API_KEY;
const AYR_API_URL = "https://api.ayrshare.com/api";

export async function POST() {
  try {
    console.log("🚀 Creating new Ayrshare user profile...");

    // Get the current authenticated user from Clerk
    const user = await currentUser();
    if (!user) {
      console.log("❌ No authenticated user found");
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    console.log(
      "✅ User authenticated:",
      user.id,
      user.primaryEmailAddress?.emailAddress
    );

    // Check if user already has a Profile-Key
    if (user.publicMetadata?.["Profile-Key"]) {
      console.log(
        "ℹ️ User already has a Profile-Key:",
        user.publicMetadata["Profile-Key"]
      );
      return NextResponse.json({
        message: "User already has an Ayrshare profile",
        ref_id: user.publicMetadata["Profile-Key"],
      });
    }

    if (!AYR_API_KEY) {
      console.error("❌ AYR_API_KEY environment variable is not set");
      return NextResponse.json(
        { error: "Configuration error: AYR_API_KEY not set" },
        { status: 500 }
      );
    }

    // Create profile title from user info
    const profileTitle =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}'s Profile`
        : user.primaryEmailAddress?.emailAddress
        ? `${user.primaryEmailAddress.emailAddress.split("@")[0]}'s Profile`
        : `User ${user.id}'s Profile`;

    console.log("📝 Creating profile with title:", profileTitle);

    // Create new Ayrshare profile
    const createProfileResponse = await fetch(`${AYR_API_URL}/profiles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AYR_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: profileTitle,
        // You can add more profile metadata here if needed
      }),
    });

    if (!createProfileResponse.ok) {
      const errorData = await createProfileResponse.text();
      console.error("❌ Failed to create Ayrshare profile:", errorData);
      return NextResponse.json(
        { error: "Failed to create Ayrshare profile", details: errorData },
        { status: createProfileResponse.status }
      );
    }

    const profileData = await createProfileResponse.json();
    console.log("✅ Ayrshare profile created:", profileData);

    // Extract the Profile-Key from the created profile
    const refId = profileData.refId;
    if (!refId) {
      console.error(
        "❌ No Profile-Key returned from Ayrshare profile creation"
      );
      return NextResponse.json(
        { error: "No Profile-Key returned from profile creation" },
        { status: 500 }
      );
    }

    console.log("🔑 Extracted Profile-Key:", refId);

    // Store the Profile-Key in Clerk user metadata
    try {
      const clerk = await clerkClient();
      await clerk.users.updateUser(user.id, {
        publicMetadata: {
          "Profile-Key": refId,
          ayrshare_profile_created: new Date().toISOString(),
        },
      });
      console.log("✅ Successfully stored Profile-Key in Clerk metadata");
    } catch (clerkError) {
      console.error(
        "❌ Failed to store Profile-Key in Clerk metadata:",
        clerkError
      );
      // Even if Clerk update fails, we still have the profile created
      // Return success but warn about metadata storage
      return NextResponse.json({
        message: "Profile created but failed to store in user metadata",
        ref_id: refId,
        warning: "Please contact support to link your profile",
      });
    }

    return NextResponse.json(
      {
        message: "User profile created successfully",
        ref_id: refId,
        profile: profileData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating user profile:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
