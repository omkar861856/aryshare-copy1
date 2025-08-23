import { NextRequest, NextResponse } from "next/server";

const AYR_API_KEY = process.env.AYR_API_KEY;
const AYR_API_URL = "https://api.ayrshare.com/api";

export async function GET(req: NextRequest) {
  try {
    console.log("🧪 Testing Ayrshare API directly...");

    if (!AYR_API_KEY) {
      return NextResponse.json(
        {
          error: "No API key found",
          message: "AYR_API_KEY environment variable is not set",
        },
        { status: 500 }
      );
    }

    console.log("🔑 API Key found, length:", AYR_API_KEY.length);
    console.log("🔑 API Key preview:", AYR_API_KEY.substring(0, 8) + "...");

    // Test 1: Try to get profiles (this should work with just the API key)
    console.log("📡 Test 1: Testing /profiles endpoint...");
    const profilesResponse = await fetch(`${AYR_API_URL}/profiles`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AYR_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log(
      "📥 Profiles response status:",
      profilesResponse.status,
      profilesResponse.statusText
    );

    if (!profilesResponse.ok) {
      const errorText = await profilesResponse.text();
      console.log("❌ Profiles endpoint failed:", errorText);

      return NextResponse.json(
        {
          error: "Profiles endpoint failed",
          status: profilesResponse.status,
          statusText: profilesResponse.statusText,
          response: errorText,
          message: "The basic API key authentication is failing",
        },
        { status: profilesResponse.status }
      );
    }

    const profilesData = await profilesResponse.json();
    console.log(
      "✅ Profiles endpoint successful, count:",
      profilesData.count || 0
    );

    // Test 2: Try to get user details with a dummy Profile-Key
    console.log("📡 Test 2: Testing /user endpoint with dummy Profile-Key...");
    const dummyProfileKey = "test_profile_key_123";

    // Log the exact request we're making
    const userRequestHeaders = {
      Authorization: `Bearer ${AYR_API_KEY}`,
      "Profile-Key": dummyProfileKey,
      "Content-Type": "application/json",
    };

    console.log("📤 User endpoint request headers:", userRequestHeaders);
    console.log("🔍 User endpoint URL:", `${AYR_API_URL}/user`);

    const userResponse = await fetch(`${AYR_API_URL}/user`, {
      method: "GET",
      headers: userRequestHeaders,
    });

    console.log(
      "📥 User endpoint response status:",
      userResponse.status,
      userResponse.statusText
    );

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.log("❌ User endpoint failed:", errorText);

      // This is expected to fail with a dummy Profile-Key, but let's see what error we get
      return NextResponse.json({
        success: "Basic API authentication working",
        profilesCount: profilesData.count || 0,
        userEndpointTest: {
          status: userResponse.status,
          statusText: userResponse.statusText,
          expectedError:
            "Profile not found (this is expected with dummy Profile-Key)",
          actualResponse: errorText,
          requestHeaders: userRequestHeaders,
          requestUrl: `${AYR_API_URL}/user`,
        },
        message:
          "API key is working, but user endpoint test failed as expected",
      });
    }

    const userData = await userResponse.json();
    console.log(
      "✅ User endpoint successful (unexpected with dummy Profile-Key):",
      userData
    );

    return NextResponse.json({
      success: "All tests passed",
      profilesCount: profilesData.count || 0,
      userEndpointTest: {
        status: userResponse.status,
        response: userData,
        requestHeaders: userRequestHeaders,
        requestUrl: `${AYR_API_URL}/user`,
      },
      message: "API key is working correctly",
    });
  } catch (error) {
    console.error("❌ Error testing Ayrshare API:", error);
    return NextResponse.json(
      {
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace",
      },
      { status: 500 }
    );
  }
}
