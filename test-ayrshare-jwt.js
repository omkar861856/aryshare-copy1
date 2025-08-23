#!/usr/bin/env node

/**
 * Comprehensive test script for Ayrshare JWT generation
 * Based on official API documentation
 * Run with: node test-ayrshare-jwt.js
 */

const API_KEY = "7FA008E8-5E8F47C9-978AF1AF-B2F965B1";
const DOMAIN = "id-8ig3h";
const BASE_URL = "https://api.ayrshare.com/api";

// Test profile key (you'll need to create one first)
const TEST_PROFILE_KEY = "YOUR_TEST_PROFILE_KEY";

async function testJWTGeneration() {
  console.log("🧪 Testing Ayrshare JWT Generation...\n");

  try {
    // Test 1: Check if we can access the profiles endpoint
    console.log("1️⃣ Testing API access...");
    const profilesResponse = await fetch(`${BASE_URL}/profiles`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (profilesResponse.ok) {
      const profiles = await profilesResponse.json();
      console.log("✅ API access working");
      console.log(`   Found ${profiles.count || 0} profiles\n`);
      
      // If we have profiles, use the first one for testing
      if (profiles.profiles && profiles.profiles.length > 0) {
        const firstProfile = profiles.profiles[0];
        console.log(`   Using profile: ${firstProfile.title} (${firstProfile.refId})\n`);
        
        // Test 2: Generate JWT (requires private key)
        console.log("2️⃣ Testing JWT generation...");
        console.log("   ⚠️  This requires your private key in environment variables");
        console.log("   Set AYR_PRIVATE_KEY_B64 in your .env.local file\n");
        
        console.log("   Expected request body:");
        console.log("   {");
        console.log(`     "domain": "${DOMAIN}",`);
        console.log("     "privateKey": "YOUR_BASE64_PRIVATE_KEY",");
        console.log("     "base64": true,");
        console.log(`     "profileKey": "${firstProfile.refId}",`);
        console.log("     "logout": false,");
        console.log("     "allowedSocial": ["facebook", "linkedin", "instagram", "twitter", "tiktok"],");
        console.log("     "expiresIn": 5,");
        console.log("     "verify": false");
        console.log("   }\n");
        
        console.log("   Expected response:");
        console.log("   {");
        console.log("     \"status\": \"success\",");
        console.log("     \"title\": \"User Profile Title\",");
        console.log("     \"token\": \"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...\",");
        console.log("     \"url\": \"https://profile.ayrshare.com?domain=...&jwt=...\",");
        console.log("     \"emailSent\": true,");
        console.log("     \"expiresIn\": \"5m\"");
        console.log("   }\n");
        
      } else {
        console.log("   No profiles found. Create a profile first.\n");
      }
      
    } else {
      console.log("❌ API access failed:", await profilesResponse.text());
    }

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }

  console.log("🎯 Next steps:");
  console.log("   1. Create a .env.local file with your private key");
  console.log("   2. Create a user profile using the profiles API");
  console.log("   3. Test JWT generation with the profile key");
  console.log("   4. Use the returned URL to test the social linking page");
  console.log("\n📚 API Documentation:");
  console.log("   - JWT Generation: https://www.ayrshare.com/docs/apis/profiles/generate-jwt");
  console.log("   - Profile Management: https://www.ayrshare.com/docs/apis/profiles");
  console.log("   - Business SSO: https://www.ayrshare.com/docs/multiple-users/api-integration-business");
}

async function testWithLocalAPI() {
  console.log("\n🌐 Testing with your local Next.js API...");
  console.log("   Make sure your development server is running (npm run dev)\n");
  
  try {
    // Test local environment check
    console.log("1️⃣ Testing environment variables...");
    const envResponse = await fetch("http://localhost:3000/api/debug/env");
    
    if (envResponse.ok) {
      const envData = await envResponse.json();
      console.log("✅ Environment check working");
      console.log("   Environment variables:", envData.environment);
      
      if (envData.environment.ENV_FILE_LOADED === "Yes") {
        console.log("   ✅ .env.local file is loaded correctly\n");
        
        // Test local JWT generation
        console.log("2️⃣ Testing local JWT generation...");
        console.log("   Use the Connect Socials button in your dashboard");
        console.log("   Or test the API directly:\n");
        
        console.log("   GET /api/ayrshare/sso?profileKey=YOUR_PROFILE_KEY");
        console.log("   This will redirect to Ayrshare's social linking page\n");
        
      } else {
        console.log("   ❌ .env.local file is not loaded");
        console.log("   Check your file location and restart the server\n");
      }
      
    } else {
      console.log("❌ Environment check failed:", await envResponse.text());
    }
    
  } catch (error) {
    console.log("❌ Local API test failed:", error.message);
    console.log("   Make sure your Next.js server is running on port 3000");
  }
}

// Run the tests
async function runTests() {
  await testJWTGeneration();
  await testWithLocalAPI();
}

runTests().catch(console.error);
