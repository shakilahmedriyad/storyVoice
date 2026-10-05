import Link from "next/link";
import { Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function NavHeader() {
  return (
    <header className="flex min-h-22 flex-wrap items-center justify-between gap-4 border-b px-5 py-4 sm:px-8 lg:px-10">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Your Library</h1>
          <p className="text-sm text-muted-foreground">3 audiobooks</p>
        </div>
      </div>
      <LinkButton href="/create">
        <Plus /> Add book
      </LinkButton>
    </header>
  );
}
