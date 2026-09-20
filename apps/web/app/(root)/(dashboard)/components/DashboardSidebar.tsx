"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Headphones, Library, LogOut, Plus, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authClient } from "@repo/auth/authClient";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigation = [
  { label: "Library", href: "/library", icon: Library },
  { label: "Create", href: "/create", icon: Plus },
  { label: "Player", href: "/player", icon: Headphones },
  { label: "Settings", href: "/settings", icon: Settings },
];

type DashboardSidebarProps = {
  userName: string;
};

export default function DashboardSidebar({ userName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [accountOpen, setAccountOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const avatarFallback = userName.trim().charAt(0).toUpperCase() || "U";

  useEffect(() => {
    if (!accountOpen) return;

    function handleOutsideClick(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setAccountOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountOpen]);

  async function handleSignOut() {
    setIsSigningOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/sign-in";
        },
      },
    });
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-3 px-2 py-1">
          <Avatar className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Headphones size={16} />
          </Avatar>
          <span className="font-display text-xl font-semibold tracking-tight group-data-[state=collapsed]/sidebar:hidden">
            StoryVoice
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[state=collapsed]/sidebar:hidden">
            Workspace
          </SidebarGroupLabel>
          <SidebarMenu>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href} className="min-w-10 min-h-10">
                      <Icon size={17} />
                      <span className="truncate group-data-[state=collapsed]/sidebar:hidden">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="relative">
        <div ref={accountMenuRef}>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-2 py-1 text-left transition-colors hover:bg-muted/50"
            onClick={() => setAccountOpen((open) => !open)}
            aria-expanded={accountOpen}
            aria-haspopup="menu"
          >
            <Avatar className="size-8 min-w-8 overflow-hidden bg-primary">
              <AvatarFallback className="bg-primary text-xs font-bold leading-none text-primary-foreground">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 md:group-data-[state=collapsed]/sidebar:hidden">
              <p className="truncate text-sm font-semibold">{userName}</p>
              <p className="truncate text-xs text-muted-foreground">
                Personal library
              </p>
            </div>
          </button>

          {accountOpen ? (
            <div
              className="surface absolute bottom-full left-2 right-2 z-50 mb-2 p-2 shadow-lg group-data-[state=collapsed]/sidebar:bottom-2 group-data-[state=collapsed]/sidebar:left-full group-data-[state=collapsed]/sidebar:right-auto group-data-[state=collapsed]/sidebar:mb-0 group-data-[state=collapsed]/sidebar:ml-2 group-data-[state=collapsed]/sidebar:w-52"
              role="menu"
            >
              <Link
                href="/settings"
                onClick={() => setAccountOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted/60"
                role="menuitem"
              >
                <Settings size={18} />
                <span className="font-medium">Settings</span>
              </Link>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border-t px-3 py-3 text-left text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                onClick={handleSignOut}
                disabled={isSigningOut}
                role="menuitem"
              >
                <LogOut size={18} />
                <span className="font-medium">
                  {isSigningOut ? "Signing out..." : "Log out"}
                </span>
              </button>
            </div>
          ) : null}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
