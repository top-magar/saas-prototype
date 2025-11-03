'use client';

import { CommandMenu } from "@/components/command-menu";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { NotificationsPopover } from "./sidebar/nav-notifications";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const userInitials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`;

  return (
    <header className="flex h-16 shrink-0 items-center justify-end px-6 bg-transparent">
      <div className="flex items-center gap-2">
        <CommandMenu />
        <NotificationsPopover notifications={[
          {
            id: "1",
            avatar: "/avatars/01.png",
            fallback: "OM",
            text: "New order received.",
            time: "10m ago",
          },
          {
            id: "2",
            avatar: "/avatars/02.png",
            fallback: "JL",
            text: "Server upgrade completed.",
            time: "1h ago",
          },
          {
            id: "3",
            avatar: "/avatars/03.png",
            fallback: "HH",
            text: "New user signed up.",
            time: "2h ago",
          },
        ]} />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings/billing')}>
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings/workspace')}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut(() => router.push('/'))}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}