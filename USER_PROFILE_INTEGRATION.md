# User Profile Integration with Ayrshare API

This document explains how to use the new user profile integration that automatically extracts the `ref_id` from Clerk user metadata and uses it to fetch user profile details from the Ayrshare API.

## Overview

The integration consists of several components:

1. **API Route** (`/api/ayrshare/user`) - Fetches user profile details using Clerk authentication
2. **React Hook** (`useAyrshareUser`) - Provides user profile data to React components
3. **UI Component** (`UserProfileDetails`) - Displays user profile information
4. **Utility Functions** - Helper functions for working with user profiles

## How It Works

1. When a user logs in via Clerk, their `ref_id` should be stored in `user.publicMetadata.ref_id`
2. The API route extracts this `ref_id` and uses it as the `Profile-Key` header when calling Ayrshare
3. The response includes comprehensive user profile information including connected social accounts

## Prerequisites

1. **Clerk Authentication**: Users must be authenticated via Clerk
2. **Ayrshare Profile**: Users must have an existing Ayrshare profile with a `ref_id`
3. **Environment Variables**: `AYR_API_KEY` must be set in your `.env.local` file

## Usage Examples

### 1. Using the React Hook

```tsx
import { useAyrshareUser } from "@/hooks/use-ayrshare-user";

function MyComponent() {
  const { userDetails, loading, error, refetch } = useAyrshareUser();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userDetails) return <div>No profile found</div>;

  return (
    <div>
      <h2>{userDetails.title}</h2>
      <p>Ref ID: {userDetails.refId}</p>
      <p>Monthly Posts: {userDetails.monthlyPostCount}</p>

      {userDetails.activeSocialAccounts && (
        <div>
          <h3>Connected Accounts:</h3>
          {userDetails.activeSocialAccounts.map((platform) => (
            <span key={platform}>{platform}</span>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 2. Using the Utility Function

```tsx
import { fetchUserProfileDetails } from "@/lib/ayrshare-utils";

async function handleFetchProfile() {
  try {
    const profile = await fetchUserProfileDetails(true); // Include Instagram details
    console.log("Profile:", profile);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
  }
}
```

### 3. Direct API Call

```tsx
async function fetchProfile() {
  const response = await fetch("/api/ayrshare/user");
  if (response.ok) {
    const profile = await response.json();
    console.log("Profile:", profile);
  }
}
```

## API Response Structure

The API returns a `UserProfileDetails` object with the following key properties:

```typescript
interface UserProfileDetails {
  refId: string; // User's unique reference ID
  title?: string; // Profile title
  email?: string; // User's email
  activeSocialAccounts?: string[]; // List of connected platforms
  displayNames?: Array<{
    // Detailed social account info
    platform: string;
    username?: string;
    displayName?: string;
    profileUrl?: string;
    type?: string;
    messagingActive?: boolean;
    // ... more properties
  }>;
  monthlyPostCount: number; // Current month's post count
  monthlyPostQuota: number; // Monthly post limit
  messagingEnabled: boolean; // Whether messaging is enabled
  // ... more properties
}
```

## Error Handling

The integration handles various error scenarios:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: No `ref_id` found in user metadata or profile not found
- **403 Forbidden**: Access denied (API key issues)
- **500 Internal Server Error**: Server-side errors

## Setting Up User Metadata

To use this integration, you need to ensure that when users are created in Ayrshare, their `ref_id` is stored in Clerk metadata:

```typescript
// After creating an Ayrshare profile
const refId = "13a9da9e0df1183a7a6a1fc2c60b8023fa9a32a0";

// Store in Clerk metadata
await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    ref_id: refId,
  },
});
```

## Testing

You can test the integration using the debug endpoint:

```bash
GET /api/debug/user-profile
```

This will return the current user's `ref_id` if available, or an error if not found.

## Security Considerations

1. **Authentication Required**: All endpoints require Clerk authentication
2. **Metadata Access**: Only `publicMetadata` is accessible (not `unsafeMetadata`)
3. **API Key Security**: Ayrshare API key is stored server-side only
4. **User Isolation**: Users can only access their own profile data

## Troubleshooting

### Common Issues

1. **"No ref_id found"**: User doesn't have an Ayrshare profile or `ref_id` not stored in metadata
2. **"Profile not found"**: The `ref_id` exists but doesn't match an Ayrshare profile
3. **"Access denied"**: Check your `AYR_API_KEY` environment variable

### Debug Steps

1. Check if user is authenticated: `await currentUser()`
2. Verify metadata exists: `user.publicMetadata.ref_id`
3. Test Ayrshare API directly with the `ref_id`
4. Check environment variables and API key validity

## Future Enhancements

- Batch user profile fetching
- Real-time profile updates via webhooks
- Profile creation flow integration
- Social account connection status monitoring
