import { AyrshareAPI } from "./ayrshare-api";

export interface SocialAnalytics {
  status: "success" | "error";
  lastUpdated: string;
  nextUpdate: string;
  analytics: any; // Platform-specific analytics data
  quarters?: number;
  errors?: Array<{
    action: string;
    status: string;
    code: number;
    message: string;
    details?: string;
  }>;
}

export interface SocialAnalyticsResponse {
  status: "success" | "error";
  [platform: string]: SocialAnalytics | string;
}

export interface SocialAnalyticsRequest {
  platforms: string[];
  quarters?: number;
  daily?: boolean;
  period60Days?: boolean;
  userId?: string;
  userName?: string;
}

export class AnalyticsAPI {
  private ayrshareAPI: AyrshareAPI;

  constructor() {
    this.ayrshareAPI = new AyrshareAPI();
  }

  /**
   * Get connected social platforms from user profile
   * @param profile - User profile details
   * @returns Array of connected platform names
   */
  getConnectedPlatforms(profile: any): string[] {
    if (!profile) return [];

    const platforms: string[] = [];

    // Check activeSocialAccounts array
    if (
      profile.activeSocialAccounts &&
      Array.isArray(profile.activeSocialAccounts)
    ) {
      platforms.push(...profile.activeSocialAccounts);
    }

    // Check displayNames array for additional platform info
    if (profile.displayNames && Array.isArray(profile.displayNames)) {
      profile.displayNames.forEach((account: any) => {
        if (account.platform && !platforms.includes(account.platform)) {
          platforms.push(account.platform);
        }
      });
    }

    // Normalize platform names to match analytics API expectations
    return platforms.map((platform) => this.normalizePlatformName(platform));
  }

  /**
   * Normalize platform names to match analytics API expectations
   * @param platform - Raw platform name from profile
   * @returns Normalized platform name
   */
  private normalizePlatformName(platform: string): string {
    const platformMap: { [key: string]: string } = {
      facebook: "facebook",
      instagram: "instagram",
      twitter: "twitter",
      linkedin: "linkedin",
      tiktok: "tiktok",
      youtube: "youtube",
      pinterest: "pinterest",
      reddit: "reddit",
      snapchat: "snapchat",
      threads: "threads",
      bluesky: "bluesky",
      gmb: "gmb",
      googlemybusiness: "gmb",
      "google-my-business": "gmb",
      // Add more mappings as needed
    };

    const normalized = platform.toLowerCase().replace(/[^a-z0-9]/g, "");
    return platformMap[normalized] || normalized;
  }

  /**
   * Get social network analytics for user's connected platforms only
   * @param profile - User profile details
   * @param options - Additional options like quarters, daily, etc.
   * @returns Promise<SocialAnalyticsResponse>
   */
  async getConnectedPlatformAnalytics(
    profile: any,
    options: {
      quarters?: number;
      daily?: boolean;
      period60Days?: boolean;
      userId?: string;
      userName?: string;
    } = {}
  ): Promise<SocialAnalyticsResponse> {
    const connectedPlatforms = this.getConnectedPlatforms(profile);

    if (connectedPlatforms.length === 0) {
      return {
        status: "success",
        message: "No connected social platforms found",
      };
    }

    return this.getSocialAnalytics(connectedPlatforms, options);
  }

  /**
   * Get social network analytics for user profiles
   * @param platforms - Array of platforms to get analytics for
   * @param options - Additional options like quarters, daily, etc.
   * @returns Promise<SocialAnalyticsResponse>
   */
  async getSocialAnalytics(
    platforms: string[],
    options: {
      quarters?: number;
      daily?: boolean;
      period60Days?: boolean;
      userId?: string;
      userName?: string;
    } = {}
  ): Promise<SocialAnalyticsResponse> {
    const request: SocialAnalyticsRequest = {
      platforms,
      ...options,
    };

    try {
      const response = await this.ayrshareAPI.post(
        "/analytics/social",
        request
      );
      return response;
    } catch (error) {
      console.error("Error fetching social analytics:", error);
      throw error;
    }
  }

  /**
   * Get analytics for specific platforms
   * @param platforms - Array of platform names
   * @returns Promise<SocialAnalyticsResponse>
   */
  async getPlatformAnalytics(
    platforms: string[]
  ): Promise<SocialAnalyticsResponse> {
    return this.getSocialAnalytics(platforms);
  }

  /**
   * Get daily analytics for supported platforms
   * @param platforms - Array of platform names (Facebook, Instagram, TikTok, YouTube)
   * @returns Promise<SocialAnalyticsResponse>
   */
  async getDailyAnalytics(
    platforms: string[]
  ): Promise<SocialAnalyticsResponse> {
    return this.getSocialAnalytics(platforms, { daily: true });
  }

  /**
   * Get quarterly analytics for supported platforms
   * @param platforms - Array of platform names (Facebook, Instagram, YouTube)
   * @param quarters - Number of quarters (1-4)
   * @returns Promise<SocialAnalyticsResponse>
   */
  async getQuarterlyAnalytics(
    platforms: string[],
    quarters: number = 4
  ): Promise<SocialAnalyticsResponse> {
    return this.getSocialAnalytics(platforms, { quarters });
  }

  /**
   * Get TikTok 60-day analytics
   * @returns Promise<SocialAnalyticsResponse>
   */
  async getTikTokAnalytics(): Promise<SocialAnalyticsResponse> {
    return this.getSocialAnalytics(["tiktok"], { period60Days: true });
  }

  /**
   * Get X/Twitter analytics for specific user
   * @param userId - Numeric user ID
   * @param userName - Username/handle
   * @returns Promise<SocialAnalyticsResponse>
   */
  async getTwitterAnalytics(
    userId?: string,
    userName?: string
  ): Promise<SocialAnalyticsResponse> {
    const options: any = {};
    if (userId) options.userId = userId;
    if (userName) options.userName = userName;

    return this.getSocialAnalytics(["twitter"], options);
  }

  /**
   * Extract key metrics from social analytics response
   * @param response - Social analytics response
   * @returns AnalyticsSummary[]
   */
  extractMetrics(response: SocialAnalyticsResponse): AnalyticsSummary[] {
    const summaries: AnalyticsSummary[] = [];

    Object.entries(response).forEach(([platform, data]) => {
      if (
        platform === "status" ||
        platform === "lastUpdated" ||
        platform === "nextUpdate" ||
        platform === "message"
      )
        return;

      if (data && typeof data === "object" && "analytics" in data) {
        const analytics = data.analytics;
        const summary = this.createPlatformSummary(platform, analytics);
        if (summary) {
          summaries.push(summary);
        }
      }
    });

    return summaries;
  }

  /**
   * Create platform summary from analytics data
   */
  private createPlatformSummary(
    platform: string,
    analytics: any
  ): AnalyticsSummary | null {
    try {
      switch (platform) {
        case "facebook":
          return this.createFacebookSummary(analytics);
        case "instagram":
          return this.createInstagramSummary(analytics);
        case "twitter":
          return this.createTwitterSummary(analytics);
        case "linkedin":
          return this.createLinkedInSummary(analytics);
        case "tiktok":
          return this.createTikTokSummary(analytics);
        case "youtube":
          return this.createYouTubeSummary(analytics);
        case "pinterest":
          return this.createPinterestSummary(analytics);
        case "reddit":
          return this.createRedditSummary(analytics);
        case "snapchat":
          return this.createSnapchatSummary(analytics);
        case "threads":
          return this.createThreadsSummary(analytics);
        case "bluesky":
          return this.createBlueskySummary(analytics);
        case "gmb":
          return this.createGMBSummary(analytics);
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error creating summary for ${platform}:`, error);
      return null;
    }
  }

  private createFacebookSummary(analytics: any): AnalyticsSummary {
    return {
      platform: "facebook",
      totalPosts: 0, // Not available in social analytics
      totalViews: analytics.pageImpressions || 0,
      totalLikes: analytics.fanCount || analytics.engagement?.count || 0,
      totalComments: 0, // Not available in social analytics
      totalShares: 0, // Not available in social analytics
      totalEngagement: analytics.pagePostEngagements || 0,
      averageViews: analytics.pageImpressions || 0,
      averageLikes: analytics.fanCount || analytics.engagement?.count || 0,
      averageComments: 0,
      averageShares: 0,
      averageEngagement: analytics.pagePostEngagements || 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  private createInstagramSummary(analytics: any): AnalyticsSummary {
    return {
      platform: "instagram",
      totalPosts: analytics.mediaCount || 0,
      totalViews: analytics.viewsCount || 0,
      totalLikes: analytics.likeCount || 0,
      totalComments: analytics.commentsCount || 0,
      totalShares: 0, // Not available in social analytics
      totalEngagement:
        (analytics.likeCount || 0) + (analytics.commentsCount || 0),
      averageViews: analytics.viewsCount || 0,
      averageLikes: analytics.likeCount || 0,
      averageComments: analytics.commentsCount || 0,
      averageShares: 0,
      averageEngagement:
        (analytics.likeCount || 0) + (analytics.commentsCount || 0),
      lastUpdated: new Date().toISOString(),
    };
  }

  private createTwitterSummary(analytics: any): AnalyticsSummary {
    return {
      platform: "twitter",
      totalPosts: analytics.tweetCount || 0,
      totalViews: 0, // Not available in social analytics
      totalLikes: analytics.likeCount || 0,
      totalComments: 0, // Not available in social analytics
      totalShares: 0, // Not available in social analytics
      totalEngagement: analytics.likeCount || 0,
      averageViews: 0,
      averageLikes: analytics.likeCount || 0,
      averageComments: 0,
      averageShares: 0,
      averageEngagement: analytics.likeCount || 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  private createLinkedInSummary(analytics: any): AnalyticsSummary {
    return {
      platform: "linkedin",
      totalPosts: 0, // Not available in social analytics
      totalViews: analytics.impressionCount || 0,
      totalLikes: analytics.likeCount || 0,
      totalComments: analytics.commentCount || 0,
      totalShares: analytics.shareCount || 0,
      totalEngagement:
        (analytics.likeCount || 0) +
        (analytics.commentCount || 0) +
        (analytics.shareCount || 0),
      averageViews: analytics.impressionCount || 0,
      averageLikes: analytics.likeCount || 0,
      averageComments: analytics.commentCount || 0,
      averageShares: analytics.shareCount || 0,
      averageEngagement:
        (analytics.likeCount || 0) +
        (analytics.commentCount || 0) +
        (analytics.shareCount || 0),
      lastUpdated: new Date().toISOString(),
    };
  }

  private createTikTokSummary(analytics: any): AnalyticsSummary {
    return {
      platform: "tiktok",
      totalPosts: analytics.videoCountTotal || 0,
      totalViews: analytics.viewCountTotal || 0,
      totalLikes: analytics.likeCountTotal || 0,
      totalComments: analytics.commentCountTotal || 0,
      totalShares: analytics.shareCountTotal || 0,
      totalEngagement:
        (analytics.likeCountTotal || 0) +
        (analytics.commentCountTotal || 0) +
        (analytics.shareCountTotal || 0),
      averageViews: analytics.viewCountTotal || 0,
      averageLikes: analytics.likeCountTotal || 0,
      averageComments: analytics.commentCountTotal || 0,
      averageShares: analytics.shareCountTotal || 0,
      averageEngagement:
        (analytics.likeCountTotal || 0) +
        (analytics.commentCountTotal || 0) +
        (analytics.shareCountTotal || 0),
      lastUpdated: new Date().toISOString(),
    };
  }

  private createYouTubeSummary(analytics: any): AnalyticsSummary {
    return {
      platform: "youtube",
      totalPosts: parseInt(analytics.videoCount) || 0,
      totalViews: parseInt(analytics.viewCount) || 0,
      totalLikes: analytics.likes || 0,
      totalComments: analytics.comments || 0,
      totalShares: analytics.shares || 0,
      totalEngagement:
        (analytics.likes || 0) +
        (analytics.comments || 0) +
        (analytics.shares || 0),
      averageViews: parseInt(analytics.viewCount) || 0,
      averageLikes: analytics.likes || 0,
      averageComments: analytics.comments || 0,
      averageShares: analytics.shares || 0,
      averageEngagement:
        (analytics.likes || 0) +
        (analytics.comments || 0) +
        (analytics.shares || 0),
      lastUpdated: new Date().toISOString(),
    };
  }

  private createPinterestSummary(analytics: any): AnalyticsSummary {
    return {
      platform: "pinterest",
      totalPosts: analytics.board?.pinCount || 0,
      totalViews: analytics.impression || 0,
      totalLikes: 0, // Not available in social analytics
      totalComments: 0, // Not available in social analytics
      totalShares: analytics.save || 0,
      totalEngagement: analytics.engagement || 0,
      averageViews: analytics.impression || 0,
      averageLikes: 0,
      averageComments: 0,
      averageShares: analytics.save || 0,
      averageEngagement: analytics.engagement || 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  private createRedditSummary(analytics: any): AnalyticsSummary {
    return {
      platform: "reddit",
      totalPosts: 0, // Not available in social analytics
      totalViews: 0, // Not available in social analytics
      totalLikes: analytics.totalKarma || 0,
      totalComments: 0, // Not available in social analytics
      totalShares: 0, // Not available in social analytics
      totalEngagement: analytics.totalKarma || 0,
      averageViews: 0,
      averageLikes: analytics.totalKarma || 0,
      averageComments: 0,
      averageShares: 0,
      averageEngagement: analytics.totalKarma || 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  private createSnapchatSummary(analytics: any): AnalyticsSummary {
    const firstAnalytic = Array.isArray(analytics) ? analytics[0] : analytics;
    return {
      platform: "snapchat",
      totalPosts: 0, // Not available in social analytics
      totalViews: firstAnalytic?.views || 0,
      totalLikes: 0, // Not available in social analytics
      totalComments: 0, // Not available in social analytics
      totalShares: firstAnalytic?.shares || 0,
      totalEngagement: firstAnalytic?.interactions || 0,
      averageViews: firstAnalytic?.views || 0,
      averageLikes: 0,
      averageComments: 0,
      averageShares: firstAnalytic?.shares || 0,
      averageEngagement: firstAnalytic?.interactions || 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  private createThreadsSummary(analytics: any): AnalyticsSummary {
    return {
      platform: "threads",
      totalPosts: 0, // Not available in social analytics
      totalViews: analytics.views || 0,
      totalLikes: analytics.likes || 0,
      totalComments: analytics.replies || 0,
      totalShares: analytics.reposts || 0,
      totalEngagement:
        (analytics.likes || 0) +
        (analytics.replies || 0) +
        (analytics.reposts || 0),
      averageViews: analytics.views || 0,
      averageLikes: analytics.likes || 0,
      averageComments: analytics.replies || 0,
      averageShares: analytics.reposts || 0,
      averageEngagement:
        (analytics.likes || 0) +
        (analytics.replies || 0) +
        (analytics.reposts || 0),
      lastUpdated: new Date().toISOString(),
    };
  }

  private createBlueskySummary(analytics: any): AnalyticsSummary {
    return {
      platform: "bluesky",
      totalPosts: analytics.postsCount || 0,
      totalViews: 0, // Not available in social analytics
      totalLikes: 0, // Not available in social analytics
      totalComments: 0, // Not available in social analytics
      totalShares: 0, // Not available in social analytics
      totalEngagement: 0,
      averageViews: 0,
      averageLikes: 0,
      averageComments: 0,
      averageShares: 0,
      averageEngagement: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  private createGMBSummary(analytics: any): AnalyticsSummary {
    return {
      platform: "gmb",
      totalPosts: 0, // Not available in social analytics
      totalViews:
        (analytics.businessImpressionsDesktopSearch || 0) +
        (analytics.businessImpressionsMobileSearch || 0) +
        (analytics.businessImpressionsDesktopMaps || 0) +
        (analytics.businessImpressionsMobileMaps || 0),
      totalLikes: 0, // Not available in social analytics
      totalComments: 0, // Not available in social analytics
      totalShares: 0, // Not available in social analytics
      totalEngagement:
        (analytics.callClicks || 0) + (analytics.websiteClicks || 0),
      averageViews:
        (analytics.businessImpressionsDesktopSearch || 0) +
        (analytics.businessImpressionsMobileSearch || 0) +
        (analytics.businessImpressionsDesktopMaps || 0) +
        (analytics.businessImpressionsMobileMaps || 0),
      averageLikes: 0,
      averageComments: 0,
      averageShares: 0,
      averageEngagement:
        (analytics.callClicks || 0) + (analytics.websiteClicks || 0),
      lastUpdated: new Date().toISOString(),
    };
  }
}

export interface AnalyticsSummary {
  platform: string;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalEngagement: number;
  averageViews: number;
  averageLikes: number;
  averageComments: number;
  averageShares: number;
  averageEngagement: number;
  lastUpdated: string;
}

// Platform-specific analytics helpers
export const PLATFORM_NAMES = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  threads: "Threads",
  tiktok: "TikTok",
  twitter: "Twitter",
  youtube: "YouTube",
  pinterest: "Pinterest",
  reddit: "Reddit",
  snapchat: "Snapchat",
  bluesky: "Bluesky",
  gmb: "Google My Business",
} as const;

export type PlatformType = keyof typeof PLATFORM_NAMES;

export const getPlatformIcon = (platform: PlatformType) => {
  const icons = {
    facebook: "📘",
    instagram: "📷",
    linkedin: "💼",
    threads: "🧵",
    tiktok: "🎵",
    twitter: "🐦",
    youtube: "📺",
    pinterest: "📌",
    reddit: "🤖",
    snapchat: "👻",
    bluesky: "☁️",
    gmb: "🏢",
  };
  return icons[platform] || "📱";
};

export const getPlatformColor = (platform: PlatformType) => {
  const colors = {
    facebook: "text-blue-600",
    instagram: "text-pink-600",
    linkedin: "text-blue-700",
    threads: "text-gray-800",
    tiktok: "text-black",
    twitter: "text-blue-400",
    youtube: "text-red-600",
    pinterest: "text-red-500",
    reddit: "text-orange-500",
    snapchat: "text-yellow-400",
    bluesky: "text-blue-500",
    gmb: "text-green-600",
  };
  return colors[platform] || "text-gray-600";
};
