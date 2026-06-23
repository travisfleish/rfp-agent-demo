"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { PipelineBanner } from "@/components/rfp/pipeline-banner";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  title,
  description,
  showPipeline = false,
  headerAction,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showPipeline?: boolean;
  headerAction?: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative bg-transparent">
        <header className="sticky top-0 z-10 shrink-0 border-b border-border bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/85">
          <div className="h-px bg-blue/20" />
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <SidebarTrigger className="-ml-1 text-navy/70 hover:text-navy" />
            <Separator orientation="vertical" className="mr-1 h-5" />
            {title && (
              <div className="min-w-0 flex-1">
                <h1 className="truncate font-heading text-lg font-semibold tracking-tight text-navy md:text-xl">
                  {title}
                </h1>
                {description && (
                  <p className="truncate text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            )}
            {headerAction && (
              <div className="shrink-0">{headerAction}</div>
            )}
          </div>
        </header>
        <main className={cn("flex-1 px-4 py-6 md:px-8 md:py-8")}>
          {showPipeline && (
            <div className="mb-8">
              <PipelineBanner />
            </div>
          )}
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
