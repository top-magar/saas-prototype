
'use client';

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, Shield, Settings, Edit, Save, Moon, Sun, Monitor, Globe, Bell, Clock, CreditCard } from "lucide-react";
import { useDateFormat } from "@/hooks/use-date-format";
import { useTheme } from "next-themes";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CurrencySelector } from "@/components/currency-selector";
import { LanguageSelector } from "@/components/language-selector";
import { TimezoneSelector } from "@/components/timezone-selector";

export default function UserProfilePage() {
  const { data: session, status } = useSession();
  const { formatDate } = useDateFormat();
  const { theme, setTheme } = useTheme();

  const user = session?.user;
  const isLoaded = status !== "loading";

  // Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");


  // Preferences State
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Asia/Kathmandu");
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  if (!isLoaded) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <div className="p-6">Not authenticated.</div>;
  }

  const handleSaveProfile = async () => {
    try {
      // In a real app, you would call an API to update the user profile here
      // await updateProfile({ name });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error("Failed to update profile");
    }
  };

  const handleSavePreferences = () => {
    toast.success("Preferences saved successfully");
  };

  // const joinedDate = user.createdAt ? formatDate(user.createdAt) : 'N/A';
  const joinedDate = 'N/A'; // NextAuth session doesn't usually have createdAt by default

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and application preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        {/* Sidebar / User Card */}
        <Card className="h-fit rounded-xl border-border/50 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-24 h-24 rounded-xl border-2 border-border">
                <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                <AvatarFallback className="rounded-xl text-2xl">
                  {user.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground break-all">{user.email}</p>
                <div className="mt-3">
                  <Badge variant="secondary" className="rounded-full px-3">USER</Badge>
                </div>
              </div>
              <Button asChild className="w-full rounded-full" variant="outline">
                <Link href="/user">
                  <Settings className="mr-2 h-4 w-4" />
                  Clerk Account
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 rounded-xl mb-6">
            <TabsTrigger value="general" className="rounded-lg px-4 py-2">General</TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-lg px-4 py-2">Preferences</TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg px-4 py-2">Security</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="mt-0 space-y-6">
            <Card className="rounded-xl border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details.</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                    className="rounded-full"
                  >
                    {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                    {isEditing ? "Save" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    {isEditing ? (
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-lg"
                      />
                    ) : (
                      <div className="p-2.5 bg-muted/30 rounded-lg text-sm border border-transparent">
                        {user.name || "Not provided"}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <div className="p-2.5 bg-muted/30 rounded-lg text-sm text-muted-foreground border border-transparent flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Member Since</label>
                    <div className="p-2.5 bg-muted/30 rounded-lg text-sm text-muted-foreground border border-transparent flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {joinedDate}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="mt-0 space-y-6">
            <Card className="rounded-xl border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Monitor className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Appearance & Localization</CardTitle>
                      <CardDescription>Customize your experience.</CardDescription>
                    </div>
                  </div>
                  <Button onClick={handleSavePreferences} size="sm" className="rounded-full">
                    Save Changes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {/* Theme */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${theme === "light" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                        } `}
                    >
                      <Sun className="h-6 w-6 text-orange-500" />
                      <span className="text-xs font-medium">Light</span>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                        } `}
                    >
                      <Moon className="h-6 w-6 text-blue-400" />
                      <span className="text-xs font-medium">Dark</span>
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${theme === "system" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                        } `}
                    >
                      <Monitor className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs font-medium">System</span>
                    </button>
                  </div>
                </div>

                <Separator />

                {/* Localization */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    Language
                  </label>
                  <LanguageSelector />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Timezone
                  </label>
                  <TimezoneSelector />
                </div>


                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    Currency
                  </label>
                  <div className="w-full max-w-[200px]">
                    <CurrencySelector />
                  </div>
                </div>

                <Separator />

                {/* Notifications */}
                <div className="space-y-4">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    Notifications
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Notifications</span>
                      <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Push Notifications</span>
                      <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Marketing Emails</span>
                      <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-0 space-y-6">
            <Card className="rounded-xl border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50 bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/10">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    Disabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/10">
                  <div>
                    <h4 className="font-medium">Email Verification</h4>
                    <p className="text-sm text-muted-foreground">Protect your account with a verified email.</p>
                  </div>
                  <Badge variant="default" className="rounded-full">Verified</Badge>
                </div>
                <Button asChild className="w-full rounded-full" variant="outline">
                  <Link href="/user">
                    Manage Security in Clerk
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}