# Ayrshare Business SSO + Multi-User Integration

This guide will help you set up Ayrshare Business SSO with multi-user support in your Next.js application.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in your project root:

```bash
# Ayrshare Business SSO Configuration
AYR_API_KEY=7FA008E8-5E8F47C9-978AF1AF-B2F965B1
AYR_DOMAIN=id-8ig3h
AYR_PRIVATE_KEY_B64=YOUR_BASE64_PRIVATE_KEY_HERE
```

**Important:** Replace `AYR_PRIVATE_KEY_B64` with your actual base64-encoded private key.

#### Generate Base64 Private Key

**macOS:**

```bash
base64 -i private.key | tr -d '\n' > private.key.b64
```

**Linux:**

```bash
base64 -w0 private.key > private.key.b64
```

**Windows (PowerShell):**

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("private.key")) | Out-File -FilePath "private.key.b64" -Encoding ASCII
```

### 2. What's Been Implemented

✅ **API Routes:**

- `/api/ayrshare/sso` - Generates JWT tokens for social account linking
- `/api/ayrshare/post` - Posts content on behalf of specific users
- `/api/ayrshare/profiles` - Creates and manages user profiles

✅ **Components:**

- `ConnectSocialsButton` - Drop-in button for connecting social accounts
- Enhanced dashboard with Ayrshare integration
- Dedicated profiles management page

✅ **Utilities:**

- Profile management functions
- SSO URL generation
- Social media posting utilities

## 🔧 How It Works

### User Profile Creation

1. Each user gets a unique Ayrshare profile
2. Store the returned `profileKey` in your database
3. Use this key for all subsequent operations

### Social Account Linking

1. User clicks "Connect Socials"
2. Backend calls `/profiles/generateJWT` with user's profile key
3. Ayrshare returns a short-lived SSO URL
4. User is redirected to Ayrshare's social linking page
5. User connects their social media accounts

### Posting Content

1. Use the user's `profileKey` in the `Profile-Key` header
2. Content is posted to the user's connected accounts
3. Supports multiple platforms simultaneously

## 📱 Usage Examples

### Connect Social Accounts

```tsx
<ConnectSocialsButton
  profileKey="user-profile-key-123"
  userEmail="user@example.com"
  onProfileCreated={(profileKey) => {
    // Store profileKey in your database
    console.log("Profile created:", profileKey);
  }}
/>
```

### Post Content

```tsx
import { postToSocialMedia } from "@/lib/ayrshare-utils";

// Post to specific platforms
await postToSocialMedia("user-profile-key-123", "Hello from my app!", [
  "twitter",
  "instagram",
  "linkedin",
]);
```

### Test Random Post

```tsx
import { testRandomPost } from "@/lib/ayrshare-utils";

// Quick test with random content
await testRandomPost("user-profile-key-123");
```

## 🧪 Testing

### Quick Test with Random Content

```bash
curl -H "Authorization: Bearer $AYR_API_KEY" \
     -H "Profile-Key: $PROFILE_KEY" \
     -H "Content-Type: application/json" \
     -d '{"randomPost": true, "platforms": ["facebook","instagram","linkedin","twitter"]}' \
     https://api.ayrshare.com/api/post
```

### Test SSO Generation

```bash
curl -X POST https://api.ayrshare.com/api/profiles/generateJWT \
  -H "Authorization: Bearer $AYR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "id-8ig3h",
    "privateKey": "'$AYR_PRIVATE_KEY_B64'",
    "base64": true,
    "profileKey": "'$PROFILE_KEY'"
  }'
```

## 🔒 Security Considerations

- **Private Key**: Never commit your private key to version control
- **Environment Variables**: Use `.env.local` for local development
- **Profile Keys**: Store user profile keys securely in your database
- **SSO Tokens**: Tokens expire automatically (configurable with `expiresIn`)

## 🌐 Webhook Setup (Optional)

For real-time updates on social account changes and scheduled posts:

1. Register webhook endpoints in your Ayrshare dashboard
2. Handle webhook payloads for:
   - Social account linking/unlinking
   - Scheduled post callbacks
   - Profile updates

## 🎨 Customization

### Branding

- Upload your logo in Ayrshare dashboard (Primary Profile → Settings)
- Logo appears on the social linking page

### SSO Options

```tsx
// Customize SSO behavior
{
  domain: "id-8ig3h",
  privateKey: process.env.AYR_PRIVATE_KEY_B64,
  base64: true,
  profileKey,
  logout: true,                    // Clear previous session
  allowedSocial: ["facebook", "instagram"], // Limit platforms
  redirect: "https://yourapp.com/callback", // Custom redirect
  expiresIn: 10                    // Token expiry in minutes
}
```

## 🚨 Common Issues & Solutions

### "Missing profileKey" Error

- Ensure you're passing the profileKey parameter
- Check that the profile exists in Ayrshare

### "generateJWT failed" Error

- Verify your private key is correctly base64 encoded
- Check that your domain matches exactly
- Ensure your API key has the correct permissions

### "Post failed" Error

- Verify the Profile-Key header is set correctly
- Check that the user has connected social accounts
- Ensure the platforms array contains valid platform names

## 📚 API Reference

### Core Endpoints

- **SSO**: `GET /api/ayrshare/sso?profileKey={key}`
- **Post**: `POST /api/ayrshare/post`
- **Profiles**: `POST /api/ayrshare/profiles`

### Headers Required

- **Authorization**: `Bearer {API_KEY}`
- **Profile-Key**: `{USER_PROFILE_KEY}` (for posting)
- **Content-Type**: `application/json`

## 🔄 Next Steps

1. **Database Integration**: Connect profile management to your user database
2. **Authentication**: Integrate with your existing auth system
3. **Webhooks**: Set up webhook endpoints for real-time updates
4. **Analytics**: Track posting performance and engagement
5. **Scheduling**: Implement post scheduling functionality

## 📞 Support

- **Ayrshare Documentation**: [docs.ayrshare.com](https://docs.ayrshare.com)
- **API Reference**: [api.ayrshare.com](https://api.ayrshare.com)
- **Business Support**: Contact Ayrshare for business account assistance

---

**Note**: This integration uses Ayrshare's Business SSO package. Ensure your account has the appropriate permissions and features enabled.
