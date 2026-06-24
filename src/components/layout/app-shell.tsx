"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative bg-transparent">
        <div className="px-4 pt-4 md:hidden md:px-8">
          <SidebarTrigger className="-ml-1 text-navy/70 hover:text-navy" />
        </div>
        <main className="flex-1 px-4 pt-12 pb-6 md:px-8 md:pt-20 md:pb-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
