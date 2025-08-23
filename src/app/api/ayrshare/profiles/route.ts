import { NextRequest, NextResponse } from "next/server";

const API = "https://api.ayrshare.com/api";

export async function POST(req: NextRequest) {
  try {
    const { title, email } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
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

    const res = await fetch(`${API}/profiles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title || `User ${email || "Profile"}`,
        // optional: backfill metadata fields as needed
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Create profile failed:", errorData);
      return NextResponse.json(
        {
          error: "Create profile failed",
          details: errorData,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileKey = searchParams.get("profileKey");

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

    const res = await fetch(`${API}/user?profileKey=${profileKey}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Profile-Key": profileKey,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Get profile failed:", errorData);
      return NextResponse.json(
        {
          error: "Get profile failed",
          details: errorData,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error getting profile:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
