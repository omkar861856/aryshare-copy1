"use client";

import { ConnectSocialsButton } from "@/components/connect-socials-button";
import { NoSSR } from "@/components/no-ssr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  ChevronsUpDown,
  Clock,
  Download,
  Edit,
  Eye,
  Facebook,
  Heart,
  Instagram,
  Linkedin,
  Link as LinkIcon,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Settings,
  Share2,
  Trash2,
  TrendingUp,
  Twitter,
  Upload,
  UserCircle,
  Users,
} from "lucide-react";
import { useState } from "react";

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

interface SocialPost {
  id: string;
  platform: "instagram" | "twitter" | "facebook" | "linkedin";
  content: string;
  status: "scheduled" | "published" | "draft" | "failed";
  scheduledTime?: string;
  publishedTime?: string;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
  author: {
    name: string;
    avatar: string;
  };
}

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
                    <a href="/schedule" className="w-full">
                      <div className="flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary">
                        <Calendar className="h-4 w-4" />
                        <motion.li variants={variants}>
                          {!collapsed && (
                            <p className="ml-2 text-sm font-medium">Schedule</p>
                          )}
                        </motion.li>
                      </div>
                    </a>
                    <a href="/analytics" className="w-full">
                      <div className="flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary">
                        <BarChart3 className="h-4 w-4" />
                        <motion.li variants={variants}>
                          {!collapsed && (
                            <p className="ml-2 text-sm font-medium">
                              Analytics
                            </p>
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
                    <div className="flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary">
                      <Instagram className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!collapsed && (
                          <p className="ml-2 text-sm font-medium">Instagram</p>
                        )}
                      </motion.li>
                    </div>
                    <div className="flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary">
                      <Twitter className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!collapsed && (
                          <p className="ml-2 text-sm font-medium">Twitter</p>
                        )}
                      </motion.li>
                    </div>
                    <div className="flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary">
                      <Facebook className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!collapsed && (
                          <p className="ml-2 text-sm font-medium">Facebook</p>
                        )}
                      </motion.li>
                    </div>
                    <div className="flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary">
                      <Linkedin className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!collapsed && (
                          <p className="ml-2 text-sm font-medium">LinkedIn</p>
                        )}
                      </motion.li>
                    </div>
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

function PostCard({ post }: { post: SocialPost }) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getPlatformIcon(post.platform)}
            <span className="text-sm font-medium capitalize">
              {post.platform}
            </span>
            <Badge className={cn("text-xs", getStatusColor(post.status))}>
              {post.status}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.content}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {post.status === "scheduled" && post.scheduledTime && (
              <span>Scheduled for {post.scheduledTime}</span>
            )}
            {post.status === "published" && post.publishedTime && (
              <span>Published {post.publishedTime}</span>
            )}
            {post.status === "draft" && <span>Draft</span>}
            {post.status === "failed" && <span>Failed to publish</span>}
          </div>

          {post.engagement && post.status === "published" && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{post.engagement.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{post.engagement.comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-3 w-3" />
                <span>{post.engagement.shares}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your social media posts across all platforms
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
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
  const stats = [
    {
      title: "Total Posts",
      value: "1,234",
      change: "+12%",
      icon: Upload,
      trend: "up",
    },
    {
      title: "Engagement Rate",
      value: "3.2%",
      change: "+0.5%",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Followers",
      value: "45.2K",
      change: "+8%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Scheduled",
      value: "23",
      change: "-2",
      icon: Clock,
      trend: "down",
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

  const samplePosts: SocialPost[] = [
    {
      id: "1",
      platform: "instagram",
      content:
        "Just launched our new product line! Check out these amazing features that will revolutionize your workflow. #ProductLaunch #Innovation",
      status: "published",
      publishedTime: "2 hours ago",
      engagement: { likes: 128, comments: 32, shares: 24 },
      author: { name: "John Doe", avatar: "https://github.com/shadcn.png" },
    },
    {
      id: "2",
      platform: "twitter",
      content:
        "Excited to announce our partnership with @company! This collaboration will bring amazing opportunities for our community.",
      status: "scheduled",
      scheduledTime: "Tomorrow at 9:00 AM",
      author: { name: "John Doe", avatar: "https://github.com/shadcn.png" },
    },
    {
      id: "3",
      platform: "linkedin",
      content:
        "Sharing insights from our latest industry report. The future of technology is here, and we're leading the way.",
      status: "draft",
      author: { name: "John Doe", avatar: "https://github.com/shadcn.png" },
    },
    {
      id: "4",
      platform: "facebook",
      content:
        "Thank you to everyone who attended our virtual event! The response was overwhelming and we're grateful for the support.",
      status: "failed",
      author: { name: "John Doe", avatar: "https://github.com/shadcn.png" },
    },
    {
      id: "5",
      platform: "twitter",
      content:
        "Behind the scenes look at our development process. Our team works tirelessly to bring you the best experience possible.",
      status: "published",
      publishedTime: "1 day ago",
      engagement: { likes: 89, comments: 15, shares: 12 },
      author: { name: "John Doe", avatar: "https://github.com/shadcn.png" },
    },
    {
      id: "6",
      platform: "instagram",
      content:
        "Weekend vibes at the office! Our team knows how to balance work and fun. #TeamCulture #WorkLifeBalance",
      status: "scheduled",
      scheduledTime: "Saturday at 2:00 PM",
      author: { name: "John Doe", avatar: "https://github.com/shadcn.png" },
    },
  ];

  const filteredPosts =
    activeTab === "all"
      ? samplePosts
      : samplePosts.filter((post) => post.status === activeTab);

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function SocialMediaDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

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
          <DashboardHeader />
          <StatsCards />

          {/* Ayrshare Integration */}
          <div className="grid gap-6 md:grid-cols-2">
            <NoSSR>
              <ConnectSocialsButton
                onProfileCreated={(profileKey) => {
                  console.log("Profile created:", profileKey);
                  // Profile key is now automatically stored in Clerk metadata
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
                  onClick={() => window.open("/dashboard", "_self")}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </div>
          </div>

          {/* Unified Profile Overview */}
          <div className="space-y-6">
            <ProfileOverview showActions={true} />
            <SocialAccountsOverview showActions={true} />
          </div>

          <PostsContent />
        </div>
      </main>
    </div>
  );
}

export default function DashboardDemo() {
  return <SocialMediaDashboard />;
}
