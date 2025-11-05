import * as React from "react";
import { Link } from "react-router-dom"; // For routing
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"; // Your provided component
import { Button } from "@/components/ui/button"; // shadcn Button for CTA styling
import { Download } from "lucide-react"; // Icon from your deps
import { cn } from "@/lib/utils"; // Utility from shadcn

// Optional: Add more nav items here (e.g., Home, About)
const navItems = [
  // { title: "Home", href: "/" }, // Example – uncomment if needed
  // { title: "About", href: "/about" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo/Brand – customize as needed */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tight">The Deadly Consultant</span>
        </Link>

        {/* Main Nav – using your NavigationMenu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <Link to={item.href}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.title}</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA Button: Free $10k/mo+ Roadmap – positioned right */}
        <div className="flex items-center space-x-2">
          <Link to="/2026-bi-fintech-consulting-roadmap-pdf-unlock">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2 border-primary bg-gradient-to-r from-primary/10 to-secondary/10 text-primary hover:from-primary/20 hover:to-secondary/20 hover:shadow-glow-pulse transition-all duration-300", // Custom glow from your Tailwind config
                navigationMenuTriggerStyle(), // Inherit nav hover styles
              )}
            >
              <Download className="h-4 w-4" />
              <span>Free $10k/mo+ Roadmap</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
