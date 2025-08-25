"use client";

import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { ConnectSocialsButton } from "@/components/connect-socials-button";
import { NoSSR } from "@/components/no-ssr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileOverview } from "@/components/unified/profile-overview";
import { SocialAccountsOverview } from "@/components/unified/social-accounts-overview";
import { useProfile } from "@/contexts/profile-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  BarChart3,
  ChevronsUpDown,
  Clock,
  Download,
  FileText,
  Key,
  LogOut,
  PieChart,
  Plus,
  Settings,
  TrendingUp,
  Upload,
  UserCircle,
  Users,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const sidebarVariants = {
  open: {
    width: "15rem",
  },
  closed: {
    width: "3.05rem",
  },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
};

const transitionProps = {
  type: "tween" as const,
  ease: "easeOut" as const,
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

interface DashboardSidebarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

function DashboardSidebar({
  isCollapsed = true,
  setIsCollapsed,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(isCollapsed);

  const handleMouseEnter = () => {
    setCollapsed(false);
    setIsCollapsed?.(false);
  };

  const handleMouseLeave = () => {
    setCollapsed(true);
    setIsCollapsed?.(true);
  };

  return (
    <motion.div
      className={cn(
        "sidebar fixed left-0 z-40 h-full shrink-0 border-r bg-background"
      )}
      initial={collapsed ? "closed" : "open"}
      animate={collapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative z-40 flex text-muted-foreground h-full shrink-0 flex-col bg-background transition-all"
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            <div className="flex h-[54px] w-full shrink-0 border-b p-2">
              <div className="mt-[1.5px] flex w-full">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className="w-full" asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex w-fit items-center gap-2 px-2"
                    >
                      <Avatar className="rounded size-4">
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      <motion.li
                        variants={variants}
                        className="flex w-fit items-center gap-2"
                      >
                        {!collapsed && (
                          <>
                            <p className="text-sm font-medium">
                              Social Manager
                            </p>
                            <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                          </>
                        )}
                      </motion.li>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Settings className="h-4 w-4" /> Account Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Add Platform
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className={cn("flex w-full flex-col gap-1")}>
                    <a href="/dashboard" className="w-full">
                      <div className="flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary bg-muted text-primary">
                        <BarChart3 className="h-4 w-4" />
                        <motion.li variants={variants}>
                          {!collapsed && (
                            <p className="ml-2 text-sm font-medium">
                              Dashboard
                            </p>
                          )}
                        </motion.li>
                      </div>
                    </a>
                    <a href="/content" className="w-full">
                      <div className="flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary">
                        <FileText className="h-4 w-4" />
                        <motion.li variants={variants}>
                          {!collapsed && (
                            <p className="ml-2 text-sm font-medium">Content</p>
                          )}
                        </motion.li>
                      </div>
                    </a>
                    <a href="/profiles" className="w-full">
                      <div className="flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary">
                        <Users className="h-4 w-4" />
                        <motion.li variants={variants}>
                          {!collapsed && (
                            <p className="ml-2 text-sm font-medium">Profiles</p>
                          )}
                        </motion.li>
                      </div>
                    </a>
                    <Separator className="w-full" />
                  </div>
                </ScrollArea>
              </div>
              <div className="flex flex-col p-2">
                <div className="mt-auto flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary">
                  <Settings className="h-4 w-4 shrink-0" />
                  <motion.li variants={variants}>
                    {!collapsed && (
                      <p className="ml-2 text-sm font-medium">Settings</p>
                    )}
                  </motion.li>
                </div>
                <div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="w-full">
                      <div className="flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary">
                        <Avatar className="size-4">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <motion.li
                          variants={variants}
                          className="flex w-full items-center gap-2"
                        >
                          {!collapsed && (
                            <>
                              <p className="text-sm font-medium">John Doe</p>
                              <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                            </>
                          )}
                        </motion.li>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={5}>
                      <div className="flex flex-row items-center gap-2 p-2">
                        <Avatar className="size-6">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-medium">John Doe</span>
                          <span className="line-clamp-1 text-xs text-muted-foreground">
                            john@example.com
                          </span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" /> Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}

function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Recent Posts</h2>
        <p className="text-muted-foreground">
          Monitor your social media posts and engagement
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>
    </div>
  );
}

function StatsCards() {
  const { profile, profileMetadata } = useProfile();

  const stats = [
    {
      title: "Total Posts",
      value: profile?.monthlyPostCount?.toString() || "0",
      change: profile ? "+0%" : "N/A",
      icon: Upload,
      trend: "up",
    },
    {
      title: "Monthly Quota",
      value: profile?.monthlyPostQuota?.toString() || "0",
      change: profile ? "Available" : "N/A",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Connected Accounts",
      value: profile?.activeSocialAccounts?.length?.toString() || "0",
      change: profile ? "Platforms" : "N/A",
      icon: Users,
      trend: "up",
    },
    {
      title: "Profile Status",
      value: profile?.suspended ? "Suspended" : profile ? "Active" : "None",
      change: profile?.suspended
        ? "Contact Support"
        : profile
        ? "Good"
        : "Create Profile",
      icon: Clock,
      trend: profile?.suspended ? "down" : "up",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={cn(
                "text-xs",
                stat.trend === "up" ? "text-green-600" : "text-red-600"
              )}
            >
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PostsContent() {
  const [activeTab, setActiveTab] = useState("all");
  const { profile } = useProfile();

  // Check if there are any posts to display
  const hasPosts = profile?.monthlyPostCount && profile.monthlyPostCount > 0;

  if (!hasPosts) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start creating and scheduling your social media posts to see them
            here.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Post
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Posts will appear here once you start creating content.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Sync URL search params with local state
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["overview", "analytics", "posts"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "overview") {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard?tab=${value}`);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-row bg-background">
      <DashboardSidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      <main
        className={cn(
          "flex h-screen grow flex-col overflow-auto transition-all duration-300",
          sidebarCollapsed ? "ml-12" : "ml-60"
        )}
      >
        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to your Ayrshare dashboard. Manage your profiles, social
                accounts, and content from one central location.
              </p>
            </div>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <PieChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Posts
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <DashboardHeader />
              <StatsCards />

              {/* Ayrshare Integration */}
              <div className="grid gap-6 md:grid-cols-2">
                <NoSSR>
                  <ConnectSocialsButton
                    onProfileCreated={(profileKey) => {
                      console.log("Profile created:", profileKey);
                    }}
                  />
                </NoSSR>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open("/profile", "_self")}
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      My Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open("/profiles", "_self")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Profiles
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleTabChange("analytics")}
                    >
                      <PieChart className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open("/content?tab=sso", "_self")}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Generate SSO
                    </Button>
                  </div>
                </div>
              </div>

              {/* Unified Profile Overview */}
              <div className="space-y-6">
                <ProfileOverview showActions={true} />
                <SocialAccountsOverview showActions={true} />
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsDashboard />
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-6">
              <PostsContent />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
