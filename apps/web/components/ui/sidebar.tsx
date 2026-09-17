"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

function SidebarProvider({ children }: React.PropsWithChildren) {
  const [open, setOpen] = React.useState(true);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, isMobileOpen, setIsMobileOpen }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

function Sidebar({ children, className }: React.ComponentProps<"aside">) {
  const { open, isMobileOpen, setIsMobileOpen } = useSidebar();

  return (
    <>
      {isMobileOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-foreground/15 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside
        data-state={open ? "expanded" : "collapsed"}
        className={cn(
          "group/sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[transform,width] duration-200 md:relative md:z-0",
          open ? "md:w-64" : "md:w-18",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className,
        )}
      >
        {children}
      </aside>
    </>
  );
}

function SidebarInset({ children, className }: React.ComponentProps<"main">) {
  return (
    <main className={cn("min-w-0 flex-1 bg-background", className)}>
      {children}
    </main>
  );
}

function SidebarHeader({ children, className }: React.ComponentProps<"div">) {
  return <div className={cn("p-4", className)}>{children}</div>;
}

function SidebarContent({ children, className }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto px-3", className)}>
      {children}
    </div>
  );
}

function SidebarFooter({ children, className }: React.ComponentProps<"div">) {
  return <div className={cn("border-t border-sidebar-border p-4", className)}>{children}</div>;
}

function SidebarGroup({ children, className }: React.ComponentProps<"div">) {
  return <div className={cn("relative flex w-full min-w-0 flex-col p-2", className)}>{children}</div>;
}

function SidebarGroupLabel({ children, className }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex h-8 items-center px-2 text-xs font-medium text-muted-foreground", className)}>
      {children}
    </div>
  );
}

function SidebarMenu({ children, className }: React.ComponentProps<"ul">) {
  return <ul className={cn("flex w-full min-w-0 flex-col gap-1", className)}>{children}</ul>;
}

function SidebarMenuItem({ children, className }: React.ComponentProps<"li">) {
  return <li className={cn("group/menu-item relative", className)}>{children}</li>;
}

function SidebarMenuButton({
  children,
  className,
  isActive,
  asChild,
  ...props
}: React.ComponentProps<"button"> & { isActive?: boolean; asChild?: boolean }) {
  const { open } = useSidebar();
  const classes = cn(
    "flex h-10 w-full items-center gap-3 overflow-hidden rounded-lg px-3 text-left text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    isActive && "bg-primary/15 font-semibold text-foreground hover:bg-primary/20",
    !open && "md:justify-center md:px-0",
    className,
  );

  if (asChild) {
    if (React.isValidElement<{ className?: string }>(children)) {
      return React.cloneElement(children, {
        className: cn(classes, children.props.className),
      });
    }
    return <span className={classes}>{children}</span>;
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

function SidebarTrigger({ className }: { className?: string }) {
  const { open, setOpen, setIsMobileOpen } = useSidebar();

  return (
    <Button
      aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      className={cn("size-9 rounded-lg", className)}
      onClick={() => {
        if (window.innerWidth < 768) {
          setIsMobileOpen((value) => !value);
        } else {
          setOpen((value) => !value);
        }
      }}
      size="icon"
      variant="ghost"
    >
      <Menu className="md:block" />
      <X className="hidden max-md:block" />
    </Button>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
};