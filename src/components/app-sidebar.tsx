import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Layers, 
  Settings, 
  LifeBuoy, 
  Cpu, 
  Circle,
  Activity,
  Github
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="h-14 flex items-center justify-center border-b">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg">
            <Cpu className="h-5 w-5" />
          </div>
          <span className="font-bold tracking-tight text-lg group-data-[collapsible=icon]:hidden">
            RedNox<span className="text-primary">.</span>
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/"} tooltip="Dashboard">
                <Link to="/">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Flows">
                <Link to="/">
                  <Layers className="h-4 w-4" />
                  <span>Flow Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="System Health">
                <a href="#">
                  <Activity className="h-4 w-4" />
                  <span>Runtime Health</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <a href="#">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-muted/50 group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:justify-center">
            <div className="flex items-center justify-center">
              <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500 animate-pulse" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-[10px] font-bold text-foreground uppercase leading-none">Status</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">Runtime Online</span>
            </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-8">
                <a href="https://github.com" target="_blank" rel="noreferrer">
                  <Github className="h-3.5 w-3.5" />
                  <span className="text-xs group-data-[collapsible=icon]:hidden">GitHub</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}