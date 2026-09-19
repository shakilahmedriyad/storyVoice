"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Headphones, Library, Plus, Settings } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
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

export default function DashboardSidebar() {
  const pathname = usePathname();

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
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href}>
                      <Icon size={17} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 px-2">
          <Avatar className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            R
          </Avatar>
          <div className="min-w-0 md:group-data-[state=collapsed]/sidebar:hidden">
            <p className="truncate text-sm font-semibold">Riyad</p>
            <p className="truncate text-xs text-muted-foreground">
              Personal library
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
