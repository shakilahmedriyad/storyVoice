import { SidebarTrigger } from "@/components/ui/sidebar";

export default function NavHeader() {
  return (
    <header className="flex h-22 items-center gap-3 border-b px-6 md:px-9">
      <SidebarTrigger />
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Library</h1>
        <p className="text-sm text-muted-foreground">Your audiobooks, all in one place.</p>
      </div>
    </header>
  );
}