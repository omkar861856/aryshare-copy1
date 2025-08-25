export interface AyrshareProfile {
  status: string;
  title: string;
  displayTitle?: string;
  created: {
    _seconds: number;
    _nanoseconds: number;
  };
  createdUTC: string;
  refId: string;
  activeSocialAccounts?: string[];
  suspended?: boolean;
}

export interface AyrshareProfilesResponse {
  profiles: AyrshareProfile[];
  count: number;
  lastUpdated: string;
  nextUpdate: string;
  pagination?: {
    hasMore: boolean;
    nextCursor: string;
    limit: number;
  };
}

export interface AyrshareActionLogResponse {
  profiles: {
    actionLog: Array<{
      action: string;
      refId: string;
      title: string;
      created: string;
    }>;
    userProfilesReport: Array<{
      reported: string;
      userProfileCount: number;
    }>;
    lastUpdated: string;
    nextUpdate: string;
  };
}

export interface GetProfilesParams {
  title?: string;
  refId?: string;
  hasActiveSocialAccounts?: boolean;
  includesActiveSocialAccounts?: string[];
  actionLog?: boolean | number;
  limit?: number;
  cursor?: string;
  [key: string]: unknown;
}

export interface UserProfileDetails {
  activeSocialAccounts?: string[];
  created: {
    _seconds: number;
    _nanoseconds: number;
    utc: string;
  };
  displayNames?: Array<{
    created: string;
    displayName: string;
    id: string;
    platform: string;
    profileUrl?: string;
    userImage?: string;
    username?: string;
    type?: string;
    description?: string;
    messagingActive?: boolean;
    refreshDaysRemaining?: number;
    refreshRequired?: string;
    subscriptionType?: string;
    verifiedType?: string;
    usedQuota?: number;
  }>;
  email?: string;
  lastApiCall?: string;
  messagingConversationMonthlyCount?: number;
  messagingEnabled?: boolean;
  monthlyApiCalls?: number;
  monthlyPostCount?: number;
  monthlyPostQuota?: number;
  monthlyApiCallsQuota?: number;
  refId: string;
  title?: string;
  lastUpdated?: string;
  nextUpdate?: string;
  suspended?: boolean;
  profileKey?: string;
}

export interface GetUserParams {
  instagramDetails?: boolean;
}

export class AyrshareAPI {
  private apiKey: string;
  private baseUrl: string = "https://api.ayrshare.com/api";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => url.searchParams.append(key, v));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Ayrshare API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async getProfiles(
    params?: GetProfilesParams
  ): Promise<AyrshareProfilesResponse> {
    return this.makeRequest<AyrshareProfilesResponse>("/profiles", params);
  }

  async getProfilesWithActionLog(
    params?: GetProfilesParams
  ): Promise<AyrshareActionLogResponse> {
    const actionLogParams = { ...params, actionLog: true };
    return this.makeRequest<AyrshareActionLogResponse>(
      "/profiles",
      actionLogParams
    );
  }

  async getUserDetails(
    profileKey?: string,
    params?: GetUserParams
  ): Promise<UserProfileDetails> {
    console.log("🚀 AyrshareAPI.getUserDetails called with:", {
      profileKey,
      params,
    });
    console.log(
      "🔑 Using API key:",
      this.apiKey ? `${this.apiKey.substring(0, 8)}...` : "NOT SET"
    );

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };

    if (profileKey) {
      // For user profiles, we need to use the Profile-Key header
      // The Profile-Key format might be different from refId
      headers["Profile-Key"] = profileKey;
    }

    const url = new URL(`${this.baseUrl}/user`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    console.log("🌐 Making request to:", url.toString());
    console.log("📋 Headers:", headers);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    console.log("📥 Response status:", response.status, response.statusText);

    if (!response.ok) {
      // Get more detailed error information
      let errorMessage = `Ayrshare API error: ${response.status} ${response.statusText}`;

      try {
        const errorData = await response.json();
        console.log("❌ Error response data:", errorData);
        if (errorData.message) {
          errorMessage += ` - ${errorData.message}`;
        }
        if (errorData.code) {
          errorMessage += ` (Code: ${errorData.code})`;
        }
      } catch {
        console.log("⚠️ Could not parse error response");
        // If we can't parse the error response, use the basic message
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully parsed response data");
    return data;
  }

  async post<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `Ayrshare API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async generateSSOUrl(
    profileKey: string,
    redirectUrl?: string
  ): Promise<{ url: string; expiresAt: string }> {
    console.log("🚀 AyrshareAPI.generateSSOUrl called with:", {
      profileKey,
      redirectUrl,
    });

    // Check if we have the required environment variables
    if (!process.env.AYR_DOMAIN) {
      throw new Error("AYR_DOMAIN environment variable is not set");
    }

    if (!process.env.AYR_PRIVATE_KEY_B64) {
      throw new Error("AYR_PRIVATE_KEY_B64 environment variable is not set");
    }

    const defaultRedirect = `${process.env.NEXT_PUBLIC_APP_URL}`;
    const finalRedirect = redirectUrl || defaultRedirect;

    // Generate JWT using the correct format
    console.log("🔐 Generating JWT-based SSO...");

    // Use the raw RSA private key content directly
    const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA3pIgx/VneA4VavtgXSTb4TKaqswng1SWM7FPT4Hv+r8fnrq6
DucyRUb93VbCfVWerc0QhSZ5oODswPtkY1PFRLerRyCbDe7CyDzalhgvUW2J6kd1
7cGXhnDkTidoOk3BhSku9x2NezHg6b+PeK43m/p/C/x7k6LEH3BBiziCTYlaEEir
k9c44/ZMH/Zf4ppM8HxQwEHapX41ZRzOI3Wd49hEbqZ5Rox7qfCcEQVQf3bR/RNH
2+v6ckQ8NP7BXd39Gq/sAE99ShcA9SX9V8a62krHMiQ2lLcgVSZAphHRhNtVV8hs
d/bd0rTs7N8qoI3fYVIC3oeQVEcFw08P8wcG9wIDAQABAoIBAAPDTLKUv48UDeCl
J1fry5vfEyZYFULvJyrwkHqzo68FlC9G0OZ3mi35qUkYsmkUDX66vNDDecLyio4o
seXMAMXMpSSqtHRj2P8xqDBpcENcKry/QIsofrtTJUj8+ZIixmbN73FWGpI+oaLS
DkboCyCj94noVt6EHfS6HSGRbwKIi9738sePu2oxUc8hF6JR66IUlFp/9quRizqR
bm7M68jizLoC0luf7zWDKDGt2F81QKTftwKK5eMvkG0wAA9TRgUiXt16wNtJTPi3
k7gKvG5y3pRqsoh1+7CV1S9mWxAK+wD+MZqvaFJhB5JUF85X8xxRn3OOba4+Q0Q7
3lsP6UECgYEA8CFUUbzjtucdBM5955f64iJPQ2+3WDQE+GY4WST41The2CpI+Q7P
Qi06vppWssKP5qi5VfVGmE4D4oeXaMufDNQDYRZx4BYHVsFeI+erMuQaPh/aUD2E
pbRqIhDwms2VGWc7mjwgsLHnxU1RjExuPTduBVoLtchFttQ/YNbIArkCgYEA7Ue3
3/XLFH0kIyvVLKTVfjaPYLRHspvvz+poYnTuyS0wCh2nWcLDCgTxiwSJLL5gBaO/
oeY0iHndjUIZbQ8qS60rKA9iKEjRr0f8bWVfz8ZLGWjeAy9WfM6XqsY3v92eQJEV
AD1zhINgkvozeqWCL4CYQo8jxSKpKWO1cIM3Py8CgYBH/MXpZyYhC/IAIeNOzZoR
ttVqUxB06ctfqE1WNCZAzZBpX2vW9mCd5y9IOr6pAnjfXk+JfGl4eVLi02FJsllx
IBIPRgpHcnMqx/dv7iC9tfJEE4qAKaEdiBOVONzYm68KGY+dsk7eiccAuCgtVjBq
O7bI9fCyw2Ja6BBD+L+nSQKBgBYpUaIoScxjF8H1MRbXWl1MaT3F+MBU0iQgJ5my
hC7j+o2nUV8P0rmX1pt+U/WK3lsIfTh40MVCZI/x8X//H5sr1FEMhsVub68oUQpC
op08Tv1TjxDLFg/YF9BKbSCNaV9sbYK1OpnQz29K0Q4OcUdQgmgNCHE8GIKWHncg
uqLfAoGBAKE4ebedvL3blwjkYoRMunNkmlHW0dLhGZwCtOZn7u9BjP6JAsdlj1q1
dWAdtzGbcpv7NIuaVnwCHvxOYKEfnffMbjaUHiPaK1bhRW16vC8Pyo89QvFJCEaI
3B2S0uPOtPW0PaB4CpGx+RZ775cY4vTE+qVsYfWBkXYpSg7N1QZ3
-----END RSA PRIVATE KEY-----`;

    console.log("🔑 Using raw RSA private key, length:", privateKey.length);
    console.log("🔑 Private key starts with:", privateKey.substring(0, 50));
    console.log(
      "🔑 Private key ends with:",
      privateKey.substring(privateKey.length - 50)
    );

    const payload = {
      domain: process.env.AYR_DOMAIN,
      privateKey: privateKey,
      profileKey,
      base64: false, // Set to false since we're sending raw key content
      redirect: finalRedirect,
    };

    console.log("📤 SSO Request payload:", {
      ...payload,
      privateKey: `${privateKey.substring(0, 50)}...`,
    });

    const response = await fetch(`${this.baseUrl}/profiles/generateJWT`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(
      "📥 SSO Response status:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      let errorMessage = `SSO generation failed: ${response.status} ${response.statusText}`;

      try {
        const errorData = await response.json();
        console.log("❌ SSO Error response:", errorData);

        // Handle specific Ayrshare error codes
        if (errorData.code === 189) {
          errorMessage =
            "Private key format error. The private key must include the full RSA key content with BEGIN/END headers.";
        } else if (errorData.message) {
          errorMessage += ` - ${errorData.message}`;
        }
      } catch {
        console.log("⚠️ Could not parse SSO error response");
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ JWT SSO URL generated successfully:", data);

    // Calculate expiration time - JWT URLs are valid for 5 minutes by default
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    return {
      url: data.url || data.token,
      expiresAt,
    };
  }
}

// Default API instance with environment variable
export const ayrshareAPI = new AyrshareAPI(process.env.AYR_API_KEY || "");
