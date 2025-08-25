"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useProfile } from "@/contexts/profile-context";
import { useTheme } from "@/contexts/theme-context";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  BarChart3,
  Bell,
  FileText,
  Home,
  Key,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const TopNavigation = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hasProfile } = useProfile();
  const { theme } = useTheme();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: pathname === "/dashboard",
    },
    {
      name: "Content",
      href: "/content",
      icon: FileText,
      current: pathname === "/content",
    },
    {
      name: "Profiles",
      href: "/profiles",
      icon: Users,
      current: pathname === "/profiles",
    },
    {
      name: "SSO",
      href: "/content?tab=sso",
      icon: Key,
      current: pathname === "/content" && searchParams.get("tab") === "sso",
    },
    {
      name: "Analytics",
      href: "/dashboard?tab=analytics",
      icon: BarChart3,
      current:
        pathname === "/dashboard" && searchParams.get("tab") === "analytics",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: pathname === "/settings",
    },
  ];

  if (!isLoaded) {
    return (
      <nav className="bg-[var(--nav-background)] border-b border-[var(--nav-border)] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-32 bg-[var(--muted)] rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-[var(--muted)] rounded-full animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[var(--nav-background)] border-b border-[var(--nav-border)] shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ayrshare
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={item.current ? "default" : "ghost"}
                      className={`transition-all duration-200 ${
                        item.current
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                          : "text-[var(--nav-text)] hover:text-[var(--nav-text-hover)] hover:bg-[var(--nav-bg-hover)]"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - Profile Status, Notifications, User Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Status */}
            {isSignedIn && (
              <div className="hidden md:block">
                {hasProfile ? (
                  <Badge
                    variant="default"
                    className="bg-[var(--success-bg)] text-[var(--success)] border-[var(--success-border)]"
                  >
                    <div className="w-2 h-2 bg-[var(--success)] rounded-full mr-2"></div>
                    Profile Active
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning-border)]"
                  >
                    <div className="w-2 h-2 bg-[var(--warning)] rounded-full mr-2"></div>
                    No Profile
                  </Badge>
                )}
              </div>
            )}

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-[var(--nav-text)] hover:text-[var(--nav-text-hover)] hover:bg-[var(--nav-bg-hover)] transition-all duration-200"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-[var(--error)] rounded-full"></span>
            </Button>

            {/* User Menu */}
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium text-[var(--nav-text)]">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {user?.primaryEmailAddress?.emailAddress}
                  </div>
                </div>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--nav-text)] hover:text-[var(--nav-text-hover)] hover:bg-[var(--nav-bg-hover)] transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="sm"
                    className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 transition-all duration-200"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-[var(--nav-border)]">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={item.current ? "default" : "ghost"}
                  className={`w-full justify-start transition-all duration-200 ${
                    item.current
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "text-[var(--nav-text)] hover:text-[var(--nav-text-hover)] hover:bg-[var(--nav-bg-hover)]"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
