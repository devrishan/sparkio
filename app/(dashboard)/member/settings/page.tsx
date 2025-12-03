"use client";

/**
 * Member Settings Page
 * 
 * TO REPLACE MOCKS WITH REAL API:
 * 1. Load profile from API:
 *    const { data: profile } = useQuery({
 *      queryKey: ['profile'],
 *      queryFn: () => fetch('/api/member/profile').then(r => r.json())
 *    });
 * 
 * 2. Update API endpoints:
 *    - GET /api/member/profile - Get profile
 *    - PUT /api/member/profile - Update profile
 *    - PUT /api/member/upi - Update UPI ID
 *    - PUT /api/member/notifications - Update notification preferences
 *    - PUT /api/member/privacy - Update privacy settings
 * 
 * 3. Replace localStorage with API calls in handleSave functions
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, CreditCard, Bell, Shield, LogOut, Save } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function MemberSettingsPage() {
  // Load from localStorage or API
  const [profile, setProfile] = useState({
    name: typeof window !== "undefined" ? localStorage.getItem("profile_name") || "Aditi Rao" : "Aditi Rao",
    email: typeof window !== "undefined" ? localStorage.getItem("profile_email") || "aditi@earniq.in" : "aditi@earniq.in",
    phone: typeof window !== "undefined" ? localStorage.getItem("profile_phone") || "+91 98765 43210" : "+91 98765 43210",
  });

  const [upi, setUpi] = useState({
    upiId: typeof window !== "undefined" ? localStorage.getItem("upi_id") || "aditir@upi" : "aditir@upi",
  });

  const [notifications, setNotifications] = useState({
    taskUpdates: typeof window !== "undefined" ? localStorage.getItem("notif_taskUpdates") !== "false" : true,
    referralAlerts: typeof window !== "undefined" ? localStorage.getItem("notif_referralAlerts") !== "false" : true,
    withdrawalNotifications: typeof window !== "undefined" ? localStorage.getItem("notif_withdrawalNotifications") !== "false" : true,
    marketing: typeof window !== "undefined" ? localStorage.getItem("notif_marketing") === "true" : false,
  });

  const [privacy, setPrivacy] = useState({
    showOnLeaderboard: typeof window !== "undefined" ? localStorage.getItem("privacy_showOnLeaderboard") !== "false" : true,
    allowReferrals: typeof window !== "undefined" ? localStorage.getItem("privacy_allowReferrals") !== "false" : true,
    shareData: typeof window !== "undefined" ? localStorage.getItem("privacy_shareData") === "true" : false,
  });

  const handleSaveProfile = () => {
    // Save to localStorage (replace with API call)
    if (typeof window !== "undefined") {
      localStorage.setItem("profile_name", profile.name);
      localStorage.setItem("profile_email", profile.email);
      localStorage.setItem("profile_phone", profile.phone);
    }
    toast.success("Profile updated", {
      description: "Your profile information has been saved.",
    });
  };

  const handleSaveUPI = () => {
    // Save to localStorage (replace with API call)
    if (typeof window !== "undefined") {
      localStorage.setItem("upi_id", upi.upiId);
    }
    toast.success("UPI ID updated", {
      description: "Your UPI ID has been saved.",
    });
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "/login";
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Settings</p>
        <h1 className="text-3xl font-semibold text-white">Control Center</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings, preferences, and privacy.
        </p>
      </header>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-orange-300" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Enter your phone"
              />
            </div>
          </div>
          <Button onClick={handleSaveProfile} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* UPI Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-300" />
            <CardTitle>UPI Management</CardTitle>
          </div>
          <CardDescription>Manage your UPI ID for withdrawals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              value={upi.upiId}
              onChange={(e) => setUpi({ ...upi, upiId: e.target.value })}
              placeholder="yourname@upi"
            />
            <p className="text-xs text-muted-foreground">
              This UPI ID will be used for all withdrawal requests
            </p>
          </div>
          <Button onClick={handleSaveUPI} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save UPI ID
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-300" />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Task Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when your task submissions are reviewed
              </p>
            </div>
            <Switch
              checked={notifications.taskUpdates}
              onCheckedChange={(checked) => {
                setNotifications({ ...notifications, taskUpdates: checked });
                if (typeof window !== "undefined") {
                  localStorage.setItem("notif_taskUpdates", String(checked));
                }
              }}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Referral Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Notifications when someone uses your referral code
              </p>
            </div>
            <Switch
              checked={notifications.referralAlerts}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, referralAlerts: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Withdrawal Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Updates on withdrawal request status
              </p>
            </div>
            <Switch
              checked={notifications.withdrawalNotifications}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, withdrawalNotifications: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive promotional offers and updates
              </p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, marketing: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-300" />
            <CardTitle>Privacy Settings</CardTitle>
          </div>
          <CardDescription>Control your privacy and data sharing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show on Leaderboard</Label>
              <p className="text-sm text-muted-foreground">
                Display your name and earnings on public leaderboards
              </p>
            </div>
            <Switch
              checked={privacy.showOnLeaderboard}
              onCheckedChange={(checked) =>
                setPrivacy({ ...privacy, showOnLeaderboard: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Referrals</Label>
              <p className="text-sm text-muted-foreground">
                Let others use your referral code to join
              </p>
            </div>
            <Switch
              checked={privacy.allowReferrals}
              onCheckedChange={(checked) =>
                setPrivacy({ ...privacy, allowReferrals: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Share Analytics Data</Label>
              <p className="text-sm text-muted-foreground">
                Help improve the platform by sharing anonymous usage data
              </p>
            </div>
            <Switch
              checked={privacy.shareData}
              onCheckedChange={(checked) =>
                setPrivacy({ ...privacy, shareData: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/40">
        <CardHeader>
          <CardTitle className="text-red-400">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleLogout} className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

