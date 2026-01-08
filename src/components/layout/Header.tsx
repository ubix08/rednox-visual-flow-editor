import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Cpu, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
export function Header() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <div className="bg-primary text-primary-foreground p-1 rounded">
            <Cpu className="h-4 w-4" />
          </div>
          <span className="hidden sm:inline-block">RedNox Studio</span>
        </div>
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground ml-4">
          <Link to="/" className="flex items-center hover:text-foreground transition-colors">
            <LayoutDashboard className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
          {pathSegments.length > 0 && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium capitalize">
                {pathSegments[pathSegments.length - 1]}
              </span>
            </>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle className="relative top-0 right-0" />
        </div>
      </div>
    </header>
  );
}