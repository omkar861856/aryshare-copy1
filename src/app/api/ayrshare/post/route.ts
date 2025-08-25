import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { post, platforms, mediaUrls, isVideo } = await request.json();

    const AYR_API_KEY = process.env.AYR_API_KEY;

    if (!AYR_API_KEY) {
      return NextResponse.json(
        { error: "Ayrshare API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.ayrshare.com/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AYR_API_KEY}`,
      },
      body: JSON.stringify({
        post,
        platforms,
        mediaUrls,
        isVideo,
      }),
    });

    const responseData = await response.json();

    // Always return the Ayrshare response, regardless of HTTP status
    // This allows the client to handle success/error cases properly
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error("Error posting to Ayrshare:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
