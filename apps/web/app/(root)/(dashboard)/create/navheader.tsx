import { SidebarTrigger } from "@/components/ui/sidebar";

export default function NavHeader() {
  return (
    <header className="flex h-22 items-center gap-3 border-b px-6 md:px-9">
      <SidebarTrigger />
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Create your audiobook</h1>
        <p className="text-sm text-muted-foreground">Choose a PDF and a narration style.</p>
      </div>
    </header>
  );
}