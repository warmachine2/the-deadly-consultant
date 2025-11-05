import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo/Brand – links to home */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tight">The Deadly Consultant</span>
        </Link>

        {/* CTA Button: Free $10k/mo+ Roadmap – right-aligned */}
        <div className="flex items-center space-x-2">
          <Link to="/2026-bi-fintech-consulting-roadmap-pdf-unlock">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "group gap-2 border-primary bg-gradient-to-r from-primary/10 to-secondary/10 text-primary transition-all duration-300",
                "hover:from-primary/20 hover:to-secondary/20 hover:animate-glow-pulse", // Uses your Tailwind animation
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
