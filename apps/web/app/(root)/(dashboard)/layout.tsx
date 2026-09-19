import type { PropsWithChildren } from "react";
import DashboardSidebar from "./components/DashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import getSession from "@/lib/get-session";
import requireAuth from "@/lib/requireAuth";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  await requireAuth();
  const session = await getSession();

  if (!session) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-background">
        <DashboardSidebar userName={session.user.name} />
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
