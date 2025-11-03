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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PlatformSettingsPage() {
  const [platformName, setPlatformName] = useState("SaaS Prototype");
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [allowUserRegistration, setAllowUserRegistration] = useState(true);
  const [adminEmail, setAdminEmail] = useState("admin@example.com");
  const [smtpHost, setSmtpHost] = useState("smtp.example.com");

  const handleSaveChanges = () => {
    console.log("Saving platform settings:", {
      platformName,
      defaultCurrency,
      allowUserRegistration,
      adminEmail,
      smtpHost,
    });
    // In a real app, this would involve an API call to save settings
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h1 className="text-xl font-semibold md:text-2xl">Platform Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>General Platform Settings</CardTitle>
          <CardDescription>Configure core settings for your SaaS platform.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field>
            <FieldLabel>Platform Name</FieldLabel>
            <FieldContent>
              <Input
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
              />
              <FieldDescription>
                The name of your SaaS platform, displayed publicly.
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Default Currency</FieldLabel>
            <FieldContent>
              <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - United States Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                The default currency used for all transactions.
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Allow User Registration</FieldLabel>
            <FieldContent>
              <Switch
                checked={allowUserRegistration}
                onCheckedChange={setAllowUserRegistration}
              />
              <FieldDescription>
                Enable or disable new user sign-ups for the platform.
              </FieldDescription>
            </FieldContent>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>Configure email sending for notifications and alerts.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field>
            <FieldLabel>Admin Email Address</FieldLabel>
            <FieldContent>
              <Input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
              <FieldDescription>
                Email address for system notifications and alerts.
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>SMTP Host</FieldLabel>
            <FieldContent>
              <Input
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
              />
              <FieldDescription>
                The SMTP server host for sending outgoing emails.
              </FieldDescription>
            </FieldContent>
          </Field>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveChanges}>Save Platform Settings</Button>
      </div>
    </div>
  );
}
