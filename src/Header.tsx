import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Home } from "lucide-react"; // Added Home icon
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        {/* Banner/Logo Section: Enhanced with "Return to Main" Home button */}
        <div className="flex items-center space-x-4">
          {/* Main Logo/Banner Title – links to home */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="font-bold text-xl tracking-tight text-primary group-hover:text-primary/80 transition-colors">
              The Deadly Consultant
            </span>
          </Link>

          {/* New: "Return to Main Page" Home Button – subtle, icon-first */}
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200",
                "hover:animate-glow-pulse", // Optional subtle glow on hover
              )}
              title="Return to Main Page"
            >
              <Home className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Home</span> {/* Hide text on mobile */}
            </Button>
          </Link>
        </div>

        {/* CTA Button: Free $10k/mo+ Roadmap – right-aligned (unchanged) */}
        <div className="flex items-center space-x-2">
          <Link to="/2026-bi-fintech-consulting-roadmap-pdf-unlock">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "group gap-2 border-primary bg-gradient-to-r from-primary/10 to-secondary/10 text-primary transition-all duration-300",
                "hover:from-primary/20 hover:to-secondary/20 hover:animate-glow-pulse",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
