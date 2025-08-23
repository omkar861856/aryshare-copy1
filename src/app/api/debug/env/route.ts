import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.AYR_API_KEY;
    const domain = process.env.AYR_DOMAIN;

    return NextResponse.json({
      success: true,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasApiKey: !!apiKey,
        apiKeyLength: apiKey ? apiKey.length : 0,
        apiKeyPreview: apiKey ? `${apiKey.substring(0, 8)}...` : "Not set",
        domain: domain || "Not set",
        allEnvVars: Object.keys(process.env).filter((key) =>
          key.startsWith("AYR_")
        ),
      },
      note: "This endpoint shows environment variable status for debugging",
    });
  } catch (error) {
    console.error("Error in debug env route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
