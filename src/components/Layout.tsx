import { useLocation } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Conditional Nav: Full TopNav on home, banner on others */}
      {isHome ? (
        <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />
      ) : (
        <div className="sticky top-0 z-40 bg-gradient-to-r from-gray-900/95 to-purple-900/95 backdrop-blur border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-5xl">
            {/* Primary Return Button: Branded with text and left arrow */}
            <Link to="/" className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:backdrop-blur-sm hover:animate-glow-pulse transition-all duration-300",
                  "font-bold tracking-tight"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="text-lg" style={{ fontFamily: 'Play, sans-serif' }}>The Deadly Consultant</span>
              </Button>
            </Link>

            {/* Secondary Home Button: Quick icon-only for main page */}
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "gap-1 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:backdrop-blur-sm hover:animate-glow-pulse transition-all duration-300"
                )}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main content – adjust pt- for nav height */}
      <main className={cn("flex-1", isHome ? "pt-20" : "pt-4")}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
