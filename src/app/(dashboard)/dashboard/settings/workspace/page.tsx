"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldContent, FieldDescription } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, Globe, Shield, Bell, Palette, Users, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function WorkspaceSettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("PASAAL.IO");
  const [workspaceDescription, setWorkspaceDescription] = useState("Multi-tenant SaaS platform for Nepal");
  const [subdomain, setSubdomain] = useState("pasaal");
  const [timezone, setTimezone] = useState("Asia/Kathmandu");
  const [language, setLanguage] = useState("en");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [publicWorkspace, setPublicWorkspace] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");

  const handleSaveChanges = () => {
    toast.success("Workspace settings updated successfully");
  };

  const handleUploadLogo = () => {
    toast.success("Logo uploaded successfully");
  };

  const handleDeleteWorkspace = () => {
    toast.error("Workspace deletion requires admin confirmation");
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Workspace Settings</h1>
        <p className="text-muted-foreground">Manage your workspace configuration and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                General Information
              </CardTitle>
              <CardDescription>Basic workspace details and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/logos/pasaal-logo.png" alt="Workspace Logo" />
                  <AvatarFallback className="text-lg">PA</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" onClick={handleUploadLogo}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                </div>
              </div>

              <Field>
                <FieldLabel>Workspace Name</FieldLabel>
                <FieldContent>
                  <Input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
                  <FieldDescription>This name appears in your dashboard and emails</FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Description</FieldLabel>
                <FieldContent>
                  <Textarea value={workspaceDescription} onChange={(e) => setWorkspaceDescription(e.target.value)} rows={3} />
                  <FieldDescription>Brief description of your workspace</FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Subdomain</FieldLabel>
                <FieldContent>
                  <div className="flex">
                    <Input value={subdomain} onChange={(e) => setSubdomain(e.target.value)} className="rounded-r-none" />
                    <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                      .pasaal.io
                    </div>
                  </div>
                  <FieldDescription>Your unique workspace URL</FieldDescription>
                </FieldContent>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Localization
              </CardTitle>
              <CardDescription>Regional and language preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>Timezone</FieldLabel>
                  <FieldContent>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kathmandu">Asia/Kathmandu (NPT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Language</FieldLabel>
                  <FieldContent>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ne">नेपाली (Nepali)</SelectItem>
                        <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Configure how you receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Slack Integration</p>
                    <p className="text-sm text-muted-foreground">Send notifications to Slack</p>
                  </div>
                  <Switch checked={slackNotifications} onCheckedChange={setSlackNotifications} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
              <CardDescription>Workspace security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require 2FA for all members</p>
                    <p className="text-sm text-muted-foreground">Enforce two-factor authentication</p>
                  </div>
                  <Switch checked={twoFactorRequired} onCheckedChange={setTwoFactorRequired} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Public Workspace</p>
                    <p className="text-sm text-muted-foreground">Allow public access to workspace</p>
                  </div>
                  <Switch checked={publicWorkspace} onCheckedChange={setPublicWorkspace} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Primary Color</FieldLabel>
                <FieldContent>
                  <div className="flex items-center gap-2">
                    <Input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-10 p-1" />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1" />
                  </div>
                </FieldContent>
              </Field>
              <div className="space-y-2">
                <p className="text-sm font-medium">Color Presets</p>
                <div className="flex gap-2">
                  {["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                      onClick={() => setPrimaryColor(color)}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workspace Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Members</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Projects</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Storage Used</span>
                <Badge variant="secondary">2.4 GB</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <Badge variant="default">PRO</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible workspace actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleDeleteWorkspace} className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Workspace
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </div>
  );
}