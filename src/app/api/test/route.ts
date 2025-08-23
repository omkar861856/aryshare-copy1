import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // This will now work because Clerk middleware is properly configured
    const { userId } = await auth();

    return NextResponse.json({
      status: "success",
      message: "Authenticated API route - Clerk is working!",
      timestamp: new Date().toISOString(),
      port: process.env.PORT || 3000,
      environment: process.env.NODE_ENV || "development",
      authentication: {
        userId: userId || "Not authenticated",
        status: userId ? "✅ Authenticated" : "❌ Not authenticated",
      },
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
        secretKey: process.env.CLERK_SECRET_KEY
          ? "✅ Configured"
          : "❌ Missing",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Authentication error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
