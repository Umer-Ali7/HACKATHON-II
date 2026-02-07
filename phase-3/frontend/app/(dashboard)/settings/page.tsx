"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { getProfile, updateProfile, type ProfileData } from "@/lib/api";
import { toast } from "sonner";
import PageTransition from "@/components/layout/PageTransition";

export default function SettingsPage() {
  const { userId, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!userId) return;
    getProfile(userId)
      .then((p) => {
        setProfile(p);
        setDisplayName(p.display_name || "");
      })
      .catch(() => {});
  }, [userId]);

  const handleSaveProfile = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const updated = await updateProfile(userId, {
        display_name: displayName.trim() || undefined,
      });
      setProfile(updated);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <PageTransition>
      <div className="p-6">
        <h1 className="mb-6 font-heading text-2xl font-bold">Settings</h1>

        <Tabs defaultValue="profile" className="max-w-2xl">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input value={profile?.email ?? ""} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  size="sm"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Appearance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-muted-foreground">
                  Choose your preferred theme.
                </p>
                {mounted && (
                  <div className="flex gap-2">
                    {themeOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        variant={theme === opt.value ? "default" : "outline"}
                        size="sm"
                        className="gap-2"
                        onClick={() => setTheme(opt.value)}
                      >
                        <opt.icon className="h-4 w-4" />
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Sign out of your account.
                </p>
                <Button variant="destructive" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
