#!/usr/bin/env node

/**
 * Test script for Ayrshare profile creation
 * Run with: node test-ayrshare.js
 */

const API_KEY = process.env.AYR_API_KEY || "YOUR_API_KEY";
const BASE_URL = "https://api.ayrshare.com/api";

async function testProfileCreation() {
  console.log("🧪 Testing Ayrshare Profile Creation...\n");

  try {
    // Test 1: Create a new profile
    console.log("1️⃣ Creating new profile...");
    const createProfileResponse = await fetch(`${BASE_URL}/profiles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `Test Profile ${Date.now()}`,
        email: "test@example.com",
      }),
    });

    if (createProfileResponse.ok) {
      const newProfile = await createProfileResponse.json();
      console.log("✅ Profile created successfully!");
      console.log("   Profile Key:", newProfile.key);
      console.log("   Title:", newProfile.title);
      console.log("   Status:", newProfile.status);

      // Test 2: Get profile details
      console.log("\n2️⃣ Getting profile details...");
      const getProfileResponse = await fetch(
        `${BASE_URL}/user?profileKey=${newProfile.key}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Profile-Key": newProfile.key,
          },
        }
      );

      if (getProfileResponse.ok) {
        const profileDetails = await getProfileResponse.json();
        console.log("✅ Profile details retrieved!");
        console.log("   Title:", profileDetails.title);
        console.log(
          "   Active Social Accounts:",
          profileDetails.activeSocialAccounts?.length || 0
        );
      } else {
        console.log(
          "❌ Failed to get profile details:",
          await getProfileResponse.text()
        );
      }
    } else {
      console.log(
        "❌ Profile creation failed:",
        await createProfileResponse.text()
      );
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }

  console.log("\n🎯 Next steps:");
  console.log("   1. Use the profile key to test posting");
  console.log("   2. Test SSO generation with the profile key");
  console.log("   3. Connect social media accounts");
}

// Run the test
testProfileCreation().catch(console.error);
