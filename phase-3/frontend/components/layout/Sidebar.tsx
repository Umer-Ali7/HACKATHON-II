"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  CheckSquare,
  Settings,
  PanelLeftClose,
  PanelLeft,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = usePreferences();
  const { logout, displayName, email } = useAuth(false);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        {!sidebarCollapsed && (
          <span className="font-heading text-lg font-bold tracking-tight">
            TodoAI
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-2">
        {!sidebarCollapsed && (displayName || email) && (
          <p className="mb-2 truncate px-3 text-xs text-muted-foreground">
            {displayName || email}
          </p>
        )}
        <Button
          variant="ghost"
          size={sidebarCollapsed ? "icon" : "default"}
          onClick={logout}
          className={cn(
            "w-full text-muted-foreground hover:text-destructive",
            !sidebarCollapsed && "justify-start gap-3"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!sidebarCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}
