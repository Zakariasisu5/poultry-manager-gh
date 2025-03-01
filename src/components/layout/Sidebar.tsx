
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart, 
  Feather, 
  Leaf, 
  PieChart, 
  Home,
  Settings,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        onOpenChange(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onOpenChange]);

  useEffect(() => {
    if (isMobile) {
      onOpenChange(false);
    }
  }, [location.pathname, isMobile, onOpenChange]);

  const mainNavItems: SidebarItem[] = [
    { 
      title: "Dashboard", 
      path: "/", 
      icon: Home 
    },
    { 
      title: "Livestock Tracking", 
      path: "/livestock", 
      icon: Feather,
      badge: "New"
    },
    { 
      title: "Health Management", 
      path: "/health", 
      icon: Leaf 
    },
    { 
      title: "Feed Management", 
      path: "/feed", 
      icon: BarChart 
    },
    { 
      title: "Financial Management", 
      path: "/financial", 
      icon: PieChart 
    }
  ];

  const bottomNavItems: SidebarItem[] = [
    { 
      title: "Settings", 
      path: "/settings", 
      icon: Settings 
    },
    { 
      title: "Help & Support", 
      path: "/support", 
      icon: HelpCircle 
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  if (!open) return null;

  return (
    <>
      {isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
      )}
      <div 
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-background border-r",
          "transition-transform duration-300 ease-in-out",
          isMobile && "animate-slide-in-right"
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary-foreground"
              >
                <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L12.18 4.34" />
              </svg>
            </div>
            <span className="font-semibold text-lg tracking-tight">PoultryPro</span>
          </div>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto" 
              onClick={() => onOpenChange(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close sidebar</span>
            </Button>
          )}
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)] py-4">
          <div className="flex flex-col gap-1 px-3 pt-2 pb-8">
            <div className="text-xs font-medium uppercase text-muted-foreground tracking-wider pl-4 pb-1 pt-2">
              Main
            </div>
            <nav className="flex flex-col gap-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "sidebar-link",
                    isActive(item.path) && "active"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge className="ml-auto text-xs bg-accent text-accent-foreground">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
            <div className="text-xs font-medium uppercase text-muted-foreground tracking-wider pl-4 pb-1 pt-6">
              System
            </div>
            <nav className="flex flex-col gap-1">
              {bottomNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "sidebar-link",
                    isActive(item.path) && "active"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
