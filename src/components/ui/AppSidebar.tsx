"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { ChevronRight, LayoutDashboard, Wallet} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { NavUser } from "./auth/NavUser";

type MenuItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  submenu?: {
    title: string;
    url: string;
    description: string;
  }[];
};

export const items: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Wallet",
    url: "/wallet",
    icon: Wallet,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const basePath = location.pathname.split("/")[1];

  const isLinkActive = (itemUrl: string) => {
    const currentPath = location.pathname.endsWith("/")
      ? location.pathname.slice(0, -1)
      : location.pathname;
    if (itemUrl === "/" && currentPath === `/${basePath}`) return true;
    const targetPath = `/${basePath}${itemUrl}`;
    return currentPath === targetPath;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => {
              const isActive = isLinkActive(item.url);

              if (item.submenu) {
                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={true}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={cn(
                            isActive &&
                              "bg-accent text-accent-foreground font-semibold"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isLinkActive(subItem.url)}
                              >
                                <Link
                                  to={`/${basePath}${subItem.url}`}
                                  className={cn(
                                    isLinkActive(subItem.url) && "font-semibold"
                                  )}
                                >
                                  {subItem.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(
                      isActive &&
                        "bg-accent text-accent-foreground font-semibold"
                    )}
                  >
                    <Link
                      to={`/${basePath}${item.url}`}
                      className="flex items-center gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}