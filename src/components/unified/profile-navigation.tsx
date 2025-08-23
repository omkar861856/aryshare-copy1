"use client";

import { Button } from "@/components/ui/button";
import {
  Activity,
  BarChart3,
  ChevronRight,
  Home,
  Plus,
  Settings,
  UserCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProfileNavigationProps {
  currentPage?: string;
  showBreadcrumbs?: boolean;
  showQuickActions?: boolean;
}

export function ProfileNavigation({
  currentPage = "overview",
  showBreadcrumbs = true,
  showQuickActions = true,
}: ProfileNavigationProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      key: "overview",
      label: "Overview",
      icon: UserCircle,
      href: "/profiles",
      description: "Profile summary and stats",
    },
    {
      key: "socials",
      label: "Social Accounts",
      icon: Users,
      href: "/profiles?tab=socials",
      description: "Manage connected platforms",
    },
    {
      key: "create",
      label: "Create Profile",
      icon: Plus,
      href: "/profiles?tab=create",
      description: "Set up new profiles",
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: BarChart3,
      href: "/profiles?tab=analytics",
      description: "Performance insights",
    },
    {
      key: "settings",
      label: "Settings",
      icon: Settings,
      href: "/profiles?tab=settings",
      description: "Profile configuration",
    },
  ];

  const quickActions = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      variant: "ghost" as const,
    },
    {
      label: "Activity",
      icon: Activity,
      href: "/profiles?tab=activity",
      variant: "ghost" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      {showBreadcrumbs && (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Link
            href="/dashboard"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/profiles"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <UserCircle className="h-4 w-4 mr-1" />
            Profiles
          </Link>
          {currentPage !== "overview" && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">
                {
                  navigationItems.find((item) => item.key === currentPage)
                    ?.label
                }
              </span>
            </>
          )}
        </nav>
      )}

      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Profile Management
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your Ayrshare profile and connected social media accounts
            </p>
          </div>

          {showQuickActions && (
            <div className="flex items-center gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant={action.variant}
                  size="sm"
                  asChild
                >
                  <Link href={action.href}>
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {navigationItems.map((item) => {
            const isActive = currentPage === item.key;
            const Icon = item.icon;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`group relative py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
                )}

                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {item.description}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
