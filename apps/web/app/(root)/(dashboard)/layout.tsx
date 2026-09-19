import type { PropsWithChildren } from "react";
import DashboardSidebar from "./components/DashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import requireAuth from "@/lib/requireAuth";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  await requireAuth();
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-background">
        <DashboardSidebar />
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
