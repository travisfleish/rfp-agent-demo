"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus2,
  Files,
  Archive,
  Settings,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "New RFP", href: "/new", icon: FilePlus2 },
  { title: "Existing RFPs", href: "/rfps", icon: Files },
  { title: "Historical RFPs", href: "/historical", icon: Archive },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-white/8 bg-navy">
      <SidebarHeader className="border-b border-white/8 px-4 py-5">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-lightBlue/30 transition-colors group-hover:bg-white/15">
            <Zap className="h-5 w-5 text-lightBlue" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-heading text-sm font-semibold leading-none tracking-tight text-white">
              RFP Agent OS
            </span>
            <span className="text-[11px] font-medium uppercase tracking-widest text-lightBlue/60">
              Genius Sports
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "h-10 rounded-lg px-3 transition-all",
                        isActive
                          ? "bg-white/10 text-white ring-1 ring-white/10"
                          : "text-white/60 hover:bg-white/6 hover:text-white/90"
                      )}
                    >
                      <Link href={item.href} className="relative">
                        {isActive && (
                          <span className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-lightBlue" />
                        )}
                        <item.icon
                          className={cn(
                            "h-4 w-4",
                            isActive ? "text-lightBlue" : "text-white/50"
                          )}
                        />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/8 p-4">
        <div className="rounded-lg bg-white/5 px-3 py-2.5 ring-1 ring-white/8">
          <p className="text-[11px] font-medium text-white/80">
            Commercial Operations
          </p>
          <p className="mt-0.5 text-[10px] text-white/40">Proof of Concept</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
