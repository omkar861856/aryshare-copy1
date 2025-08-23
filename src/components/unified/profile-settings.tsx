"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/contexts/profile-context";
import {
  Bell,
  Download,
  Globe,
  Key,
  Palette,
  RefreshCw,
  Save,
  Settings,
  Shield,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface ProfileSettingsProps {
  showActions?: boolean;
}

export function ProfileSettings({ showActions = true }: ProfileSettingsProps) {
  const { profile, profileMetadata } = useProfile();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      weekly: true,
      monthly: false,
    },
    privacy: {
      publicProfile: true,
      showStats: false,
      allowMessages: true,
    },
    appearance: {
      theme: "auto",
      compactMode: false,
      showAvatars: true,
    },
  });

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </CardTitle>
          <CardDescription>
            No profile data available for settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please create a profile first to access settings.
          </p>
        </CardContent>
      </Card>
    );
  }

  const updateSetting = (category: string, key: string, value: string | boolean | number) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Basic profile details and configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profileTitle">Profile Title</Label>
              <Input
                id="profileTitle"
                defaultValue={profile.title || "User Profile"}
                placeholder="Enter profile title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileEmail">Email</Label>
              <Input
                id="profileEmail"
                defaultValue={profile.email || ""}
                placeholder="Enter email address"
                type="email"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Profile Status</p>
              <p className="text-sm text-muted-foreground">
                {profileMetadata.isActive
                  ? "Active and visible"
                  : "Inactive or hidden"}
              </p>
            </div>
            <Badge variant={profileMetadata.isActive ? "default" : "secondary"}>
              {profileMetadata.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage how you receive updates and alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", "email", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  In-app notifications
                </p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", "push", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">
                  Weekly performance summaries
                </p>
              </div>
              <Switch
                checked={settings.notifications.weekly}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", "weekly", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Monthly Reports</p>
                <p className="text-sm text-muted-foreground">
                  Monthly analytics reports
                </p>
              </div>
              <Switch
                checked={settings.notifications.monthly}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", "monthly", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>
            Control your profile visibility and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Public Profile</p>
                <p className="text-sm text-muted-foreground">
                  Allow others to view your profile
                </p>
              </div>
              <Switch
                checked={settings.privacy.publicProfile}
                onCheckedChange={(checked) =>
                  updateSetting("privacy", "publicProfile", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Statistics</p>
                <p className="text-sm text-muted-foreground">
                  Display engagement metrics publicly
                </p>
              </div>
              <Switch
                checked={settings.privacy.showStats}
                onCheckedChange={(checked) =>
                  updateSetting("privacy", "showStats", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Messages</p>
                <p className="text-sm text-muted-foreground">
                  Receive messages from other users
                </p>
              </div>
              <Switch
                checked={settings.privacy.allowMessages}
                onCheckedChange={(checked) =>
                  updateSetting("privacy", "allowMessages", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize your profile display preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred theme
                </p>
              </div>
              <select
                className="px-3 py-2 border rounded-md"
                value={settings.appearance.theme}
                onChange={(e) =>
                  updateSetting("appearance", "theme", e.target.value)
                }
              >
                <option value="auto">Auto</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Compact Mode</p>
                <p className="text-sm text-muted-foreground">
                  Use condensed layout
                </p>
              </div>
              <Switch
                checked={settings.appearance.compactMode}
                onCheckedChange={(checked) =>
                  updateSetting("appearance", "compactMode", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Avatars</p>
                <p className="text-sm text-muted-foreground">
                  Display profile pictures
                </p>
              </div>
              <Switch
                checked={settings.appearance.showAvatars}
                onCheckedChange={(checked) =>
                  updateSetting("appearance", "showAvatars", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API & Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API & Integration
          </CardTitle>
          <CardDescription>
            Manage API keys and external integrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">API Key</p>
                <p className="text-sm text-muted-foreground">
                  Your Ayrshare API key
                </p>
              </div>
              <Badge variant="secondary" className="font-mono">
                {profile.refId?.substring(0, 8)}...
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export Key
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-3">
          <Button className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
