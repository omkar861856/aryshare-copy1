import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.AYR_API_KEY;

  return NextResponse.json({
    success: true,
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    apiKeyPreview: apiKey ? `${apiKey.substring(0, 8)}...` : "Not set",
    apiKeyEnd: apiKey ? `...${apiKey.substring(apiKey.length - 4)}` : "Not set",
    allEnvVars: Object.keys(process.env).filter((key) =>
      key.startsWith("AYR_")
    ),
    note: "Simple test to verify environment variable loading",
  });
}
