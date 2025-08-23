#!/usr/bin/env node

/**
 * Simple test script for Ayrshare integration
 * Run with: node test-ayrshare.js
 */

const API_KEY = "7FA008E8-5E8F47C9-978AF1AF-B2F965B1";
const DOMAIN = "id-8ig3h";
const BASE_URL = "https://api.ayrshare.com/api";

async function testAyrshareAPI() {
  console.log("🧪 Testing Ayrshare API Integration...\n");

  try {
    // Test 1: Get profiles
    console.log("1️⃣ Testing GET /profiles...");
    const profilesResponse = await fetch(`${BASE_URL}/profiles`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (profilesResponse.ok) {
      const profiles = await profilesResponse.json();
      console.log("✅ Profiles API working");
      console.log(`   Found ${profiles.count || 0} profiles\n`);
    } else {
      console.log("❌ Profiles API failed:", await profilesResponse.text());
    }

    // Test 2: Create a test profile
    console.log("2️⃣ Testing POST /profiles...");
    const createProfileResponse = await fetch(`${BASE_URL}/profiles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `Test Profile ${Date.now()}`,
      }),
    });

    if (createProfileResponse.ok) {
      const newProfile = await createProfileResponse.json();
      console.log("✅ Create profile API working");
      console.log(`   Created profile: ${newProfile.key}\n`);

      // Test 3: Generate JWT (requires private key)
      console.log("3️⃣ Testing POST /profiles/generateJWT...");
      console.log(
        "   ⚠️  This requires your private key in environment variables"
      );
      console.log("   Set AYR_PRIVATE_KEY_B64 in your .env.local file\n");

      // Test 4: Test posting (requires profile key and connected accounts)
      console.log("4️⃣ Testing POST /post...");
      console.log(
        "   ⚠️  This requires a profile key and connected social accounts"
      );
      console.log("   Use the Connect Socials button in your app first\n");
    } else {
      console.log(
        "❌ Create profile API failed:",
        await createProfileResponse.text()
      );
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }

  console.log("🎯 Next steps:");
  console.log("   1. Set up your .env.local file with AYR_PRIVATE_KEY_B64");
  console.log("   2. Run your Next.js app: npm run dev");
  console.log("   3. Navigate to /dashboard to see the integration");
  console.log("   4. Use the Connect Socials button to test SSO");
  console.log("   5. Check the profiles page for management features");
}

// Run the test
testAyrshareAPI().catch(console.error);
