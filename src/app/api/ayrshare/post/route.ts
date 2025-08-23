import { NextRequest, NextResponse } from "next/server";

const API = "https://api.ayrshare.com/api/post";

export async function POST(req: NextRequest) {
  try {
    const {
      profileKey,
      post,
      platforms = ["twitter", "facebook", "instagram", "linkedin"],
    } = await req.json();

    if (!profileKey) {
      return NextResponse.json(
        { error: "Missing profileKey" },
        { status: 400 }
      );
    }

    const apiKey = process.env.AYR_API_KEY;
    if (!apiKey) {
      console.error("AYR_API_KEY environment variable is not set");
      return NextResponse.json(
        {
          error: "Configuration error: AYR_API_KEY not set",
          details: "Please check your .env.local file",
        },
        { status: 500 }
      );
    }

    const res = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Profile-Key": profileKey, // very important for per-user posting
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post: post ?? "Hello from my app!",
        platforms,
        // for quick tests you can use random content instead of `post`:
        // randomPost: true
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Ayrshare post failed:", data);
      return NextResponse.json(
        {
          error: "Post failed",
          details: data,
        },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in Ayrshare post:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
