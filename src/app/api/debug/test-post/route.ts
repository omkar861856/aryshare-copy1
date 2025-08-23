import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Only show this in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  try {
    const { profileKey } = await req.json();

    if (!profileKey) {
      return NextResponse.json(
        { error: "Missing profileKey" },
        { status: 400 }
      );
    }

    console.log("Testing post with profileKey:", profileKey);

    // Test the Ayrshare post API directly
    const response = await fetch("https://api.ayrshare.com/api/post", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AYR_API_KEY}`,
        "Profile-Key": profileKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post: "Test post from debug endpoint",
        platforms: ["twitter", "instagram"],
        // randomPost: true, // Uncomment to test with random content
      }),
    });

    const data = await response.json();

    console.log("Ayrshare API response:", {
      status: response.status,
      ok: response.ok,
      data,
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Ayrshare API call failed",
          status: response.status,
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test post successful",
      data,
    });
  } catch (error) {
    console.error("Debug test post error:", error);
    return NextResponse.json(
      {
        error: "Debug test post failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
