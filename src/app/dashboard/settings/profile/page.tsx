import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function UserProfilePage() {
  const user = await currentUser();

  if (!user) {
    return <p>Not authenticated.</p>;
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    include: { tenant: true },
  });

  if (!dbUser) {
    return <p>User data not found.</p>;
  }

  const tenant = dbUser.tenant;

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h1 className="text-xl font-semibold md:text-2xl">User Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>View and manage your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={user.fullName || ""} readOnly />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={user.emailAddresses[0]?.emailAddress || ""} readOnly />
          </div>
          {/* Add more personal info fields if needed */}
        </CardContent>
      </Card>

      {tenant && (
        <Card>
          <CardHeader>
            <CardTitle>Tenant Information</CardTitle>
            <CardDescription>Details about your associated tenant.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="tenantName">Tenant Name</Label>
              <Input id="tenantName" defaultValue={tenant.name} readOnly />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <Input id="subdomain" defaultValue={tenant.subdomain} readOnly />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tier">Subscription Tier</Label>
              <Input id="tier" defaultValue={tenant.tier} readOnly />
            </div>
            <Separator />
            <Button asChild>
              <Link href="/dashboard/settings/billing">Manage Subscription</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Integration with Clerk's user profile management */}
      <Card>
        <CardHeader>
          <CardTitle>Clerk Profile Management</CardTitle>
          <CardDescription>Manage your security settings and connected accounts directly with Clerk.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/user">Go to Clerk User Profile</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}