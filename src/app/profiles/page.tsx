"use client";

import { CreateUserProfile } from "@/components/create-user-profile";
import { DebugUserProfile } from "@/components/debug-user-profile";
import { NoSSR } from "@/components/no-ssr";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileAnalytics } from "@/components/unified/profile-analytics";
import { ProfileNavigation } from "@/components/unified/profile-navigation";
import { ProfileOverview } from "@/components/unified/profile-overview";
import { ProfileSettings } from "@/components/unified/profile-settings";
import { SocialAccountsOverview } from "@/components/unified/social-accounts-overview";
import { SSOButton } from "@/components/unified/sso-button";
import {
  Activity,
  BarChart3,
  Bug,
  Link as LinkIcon,
  Plus,
  Settings,
  TrendingUp,
  UserCircle,
  Users,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ProfilesPage() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const navigationItems = [
    {
      key: "overview",
      label: "Overview",
      icon: UserCircle,
      description: "Profile summary and stats",
    },
    {
      key: "socials",
      label: "Social Accounts",
      icon: Users,
      description: "Manage connected platforms",
    },
    {
      key: "create",
      label: "Create Profile",
      icon: Plus,
      description: "Set up new profiles",
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "Performance insights",
    },
    {
      key: "activity",
      label: "Activity",
      icon: Activity,
      description: "Recent actions and posts",
    },
    {
      key: "settings",
      label: "Settings",
      icon: Settings,
      description: "Profile configuration",
    },
    {
      key: "debug",
      label: "Debug",
      icon: Bug,
      description: "Technical details",
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Modern Navigation */}
      <ProfileNavigation currentPage={currentTab} />

      {/* Main Content Tabs */}
      <Tabs value={currentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 h-auto p-1 bg-muted/50">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <TabsTrigger
                key={item.key}
                value={item.key}
                className="flex flex-col items-center gap-2 py-3 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <ProfileOverview showActions={true} />

          {/* SSO Section */}
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <LinkIcon className="h-5 w-5" />
                Single Sign-On (SSO)
              </CardTitle>
              <CardDescription className="text-emerald-800">
                Generate JWT-based SSO URLs to access Ayrshare with your profile
                credentials. Requires proper private key configuration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SSOButton showDetails={true} />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">
                  Total Posts
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">0</div>
                <p className="text-xs text-blue-700">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">
                  Engagement Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">0%</div>
                <p className="text-xs text-green-700">
                  Average across platforms
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">
                  Active Accounts
                </CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">0</div>
                <p className="text-xs text-purple-700">Connected platforms</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Social Accounts Tab */}
        <TabsContent value="socials" className="space-y-6">
          <SocialAccountsOverview showActions={true} />
        </TabsContent>

        {/* Create Profile Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Plus className="h-5 w-5" />
                Create New Profile
              </CardTitle>
              <CardDescription className="text-amber-800">
                Set up your Ayrshare profile to start managing social media
                accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NoSSR>
                <CreateUserProfile />
              </NoSSR>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <ProfileAnalytics showActions={true} />
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Track your latest posts and interactions across platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Recent Activity</h3>
                <p className="text-muted-foreground mb-4">
                  Start posting to see your activity feed here
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <ProfileSettings showActions={true} />
        </TabsContent>

        {/* Debug Tab */}
        <TabsContent value="debug" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Debug Information
              </CardTitle>
              <CardDescription>
                Technical details and debugging tools for troubleshooting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DebugUserProfile />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
