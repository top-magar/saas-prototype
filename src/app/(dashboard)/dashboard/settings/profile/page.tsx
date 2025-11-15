import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/database/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, Shield, Building, Crown, Settings } from "lucide-react";
import Link from "next/link";

export default async function UserProfilePage() {
  const user = await currentUser();

  if (!user) {
    return <p>Not authenticated.</p>;
  }

  const { data: dbUser } = await supabase
    .from('users')
    .select('*, tenant:tenants(*)')
    .eq('clerk_user_id', user.id)
    .single();

  if (!dbUser) {
    return <p>User data not found.</p>;
  }

  const tenant = dbUser.tenant;
  const joinedDate = new Date(user.createdAt).toLocaleDateString(    
  );
  const lastLogin = dbUser.lastLoginAt ? new Date(dbUser.lastLoginAt).toLocaleDateString() : "Never";

  const getRoleBadge = (role: string) => {
    const variants = {
      ADMIN: "default" as const,
      MANAGER: "secondary" as const,
      USER: "outline" as const,
    };
    return <Badge variant={variants[role as keyof typeof variants]}>{role}</Badge>;
  };

  const getTierBadge = (tier: string) => {
    const variants = {
      FREE: "outline" as const,
      PRO: "default" as const,
      ENTERPRISE: "destructive" as const,
    };
    return <Badge variant={variants[tier as keyof typeof variants]}>{tier}</Badge>;
  };

  return (
    
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
                <AvatarFallback className="text-2xl">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{user.fullName}</h3>
                <p className="text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</p>
                <div className="mt-2">
                  {getRoleBadge(dbUser.role)}
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/user">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4" />
                    Full Name
                  </div>
                  <p className="text-muted-foreground">{user.fullName || "Not provided"}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </div>
                  <p className="text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </div>
                  <p className="text-muted-foreground">{joinedDate}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Shield className="h-4 w-4" />
                    Last Login
                  </div>
                  <p className="text-muted-foreground">{lastLogin}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {tenant && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Organization Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Building className="h-4 w-4" />
                      Organization Name
                    </div>
                    <p className="text-muted-foreground">{tenant.name}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Crown className="h-4 w-4" />
                      Subscription Plan
                    </div>
                    <div>{getTierBadge(tenant.tier)}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Subdomain</div>
                    <p className="text-muted-foreground">{tenant.subdomain}.pasaal.io</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Status</div>
                    <Badge variant="default">{tenant.status}</Badge>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-3">
                  <Button asChild variant="outline">
                    <Link href="/dashboard/settings/workspace">
                      Workspace Settings
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/dashboard/settings/billing">
                      Manage Billing
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your security settings and authentication methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Badge variant={dbUser.mfaEnabled ? "default" : "outline"}>
                  {dbUser.mfaEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Email Verification</h4>
                  <p className="text-sm text-muted-foreground">Verify your email address</p>
                </div>
                <Badge variant="default">Verified</Badge>
              </div>
              <Button asChild className="w-full">
                <Link href="/user">
                  <Shield className="mr-2 h-4 w-4" />
                  Manage Security Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
  );
}