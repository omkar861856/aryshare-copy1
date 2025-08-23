import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "Public API route - no authentication required!",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || "development",
    ayrshare: {
      apiKey: process.env.AYR_API_KEY ? "✅ Configured" : "❌ Missing",
      domain: process.env.AYR_DOMAIN ? "✅ Configured" : "❌ Missing",
      privateKey: process.env.AYR_PRIVATE_KEY_B64
        ? "✅ Configured"
        : "❌ Missing",
    },
    clerk: {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        ? "✅ Configured"
        : "❌ Missing",
      secretKey: process.env.CLERK_SECRET_KEY ? "✅ Configured" : "❌ Missing",
    },
  });
}
