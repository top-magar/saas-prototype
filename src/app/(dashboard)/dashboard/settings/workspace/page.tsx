"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Building, Shield, Palette, Upload, Trash2, Save, Globe, Lock } from "lucide-react";
import { toast } from "sonner";

export default function WorkspaceSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("Pasaal.io");
  const [workspaceSlug, setWorkspaceSlug] = useState("pasaal");
  const [brandColor, setBrandColor] = useState("#3b82f6");
  const [require2FA, setRequire2FA] = useState(false);
  const [publicAccess, setPublicAccess] = useState(true);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success("Workspace settings updated successfully");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspace Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization's profile and security configurations.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="rounded-full px-6">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Identity Section */}
        <Card className="rounded-xl border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Identity</CardTitle>
                <CardDescription>Set your workspace name and logo.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="group relative">
                <Avatar className="w-24 h-24 rounded-xl border-2 border-border shadow-sm">
                  <AvatarImage src="/images/logos/company-logo.svg" />
                  <AvatarFallback className="rounded-xl text-2xl font-bold bg-muted">PA</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-4 flex-1 w-full">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Workspace Name</label>
                  <Input
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Workspace URL</label>
                  <div className="flex rounded-lg shadow-sm">
                    <Input
                      value={workspaceSlug}
                      onChange={(e) => setWorkspaceSlug(e.target.value)}
                      className="rounded-r-none border-r-0 focus-visible:ring-0"
                    />
                    <div className="px-4 py-2 bg-muted border border-l-0 rounded-r-lg text-sm text-muted-foreground font-mono flex items-center">
                      .pasaal.io
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding Section */}
        <Card className="rounded-xl border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Branding</CardTitle>
                <CardDescription>Customize your workspace appearance.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">Brand Color</label>
              <div className="flex flex-wrap gap-3">
                {[
                  { color: "#3b82f6", name: "Blue" },
                  { color: "#10b981", name: "Green" },
                  { color: "#f59e0b", name: "Orange" },
                  { color: "#ef4444", name: "Red" },
                  { color: "#8b5cf6", name: "Purple" },
                  { color: "#06b6d4", name: "Cyan" },
                  { color: "#000000", name: "Black" },
                ].map(({ color, name }) => (
                  <button
                    key={color}
                    onClick={() => setBrandColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${brandColor === color ? "border-primary scale-110 ring-2 ring-primary/20" : "border-transparent hover:scale-105"
                      }`}
                    style={{ backgroundColor: color }}
                    title={name}
                  />
                ))}
                <div className="w-px h-10 bg-border mx-2" />
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-full border shadow-sm"
                    style={{ backgroundColor: brandColor }}
                  />
                  <Input
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-28 font-mono rounded-lg"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="rounded-xl border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage access and security protocols.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <label className="text-base font-medium">Enforce 2FA</label>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  Require all workspace members to enable two-factor authentication.
                </p>
              </div>
              <Switch
                checked={require2FA}
                onCheckedChange={setRequire2FA}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <label className="text-base font-medium">Public Access</label>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  Allow anyone with the link to view public resources in this workspace.
                </p>
              </div>
              <Switch
                checked={publicAccess}
                onCheckedChange={setPublicAccess}
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="rounded-xl border-destructive/20 shadow-sm overflow-hidden bg-destructive/5">
          <CardHeader className="border-b border-destructive/10">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions for this workspace.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Delete Workspace</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Permanently delete this workspace and all associated data.
                </p>
              </div>
              <Button variant="destructive" className="rounded-full">
                Delete Workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}