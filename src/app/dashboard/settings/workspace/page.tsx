"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent, FieldDescription } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function WorkspaceSettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("My SaaS Workspace");
  const [workspaceDomain, setWorkspaceDomain] = useState("mysaas.com");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleSaveChanges = () => {
    console.log("Saving changes:", {
      workspaceName,
      workspaceDomain,
      emailNotifications,
      twoFactorAuth,
    });
    // In a real app, this would involve an API call to save settings
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h1 className="text-lg font-semibold md:text-2xl">Workspace Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage your workspace name and domain.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field>
            <FieldLabel>Workspace Name</FieldLabel>
            <FieldContent>
              <Input
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
              <FieldDescription>
                This name will be displayed across your dashboard.
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Workspace Domain</FieldLabel>
            <FieldContent>
              <Input
                value={workspaceDomain}
                onChange={(e) => setWorkspaceDomain(e.target.value)}
              />
              <FieldDescription>
                Your custom domain for accessing the workspace.
              </FieldDescription>
            </FieldContent>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field>
            <FieldLabel>Email Notifications</FieldLabel>
            <FieldContent>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
              <FieldDescription>
                Receive important updates and alerts via email.
              </FieldDescription>
            </FieldContent>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Enhance the security of your workspace.</CardDescription>
          </CardHeader>
        <CardContent className="grid gap-4">
          <Field>
            <FieldLabel>Two-Factor Authentication</FieldLabel>
            <FieldContent>
              <Switch
                checked={twoFactorAuth}
                onCheckedChange={setTwoFactorAuth}
              />
              <FieldDescription>
                Add an extra layer of security to your account.
              </FieldDescription>
            </FieldContent>
          </Field>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </div>
  );
}
