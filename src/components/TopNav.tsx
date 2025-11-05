import { Search, Home, Menu, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface TopNavProps {
  onSearchChange: (query: string) => void;
  onToggleSidebar: () => void;
}

const TopNav = ({ onSearchChange, onToggleSidebar }: TopNavProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  if (isHomepage) {
    // Homepage variant: search on left, roadmap CTA button
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Left: Logo + Search */}
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
            <Link to="/">
              <h1
                className="text-xl md:text-2xl font-bold text-foreground cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap"
                style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))" }}
              >
                The{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #04c3fc 0%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Deadly
                </span>{" "}
                Consultant
              </h1>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md ml-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 glass rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Right: CTA Button */}
          <Link to="/2026-bi-fintech-consulting-roadmap-pdf-unlock">
            <button
              className="px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-semibold text-sm md:text-base text-white hover-glow transition-all whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #04c3fc 0%, #0891d4 100%)",
                boxShadow: "0 0 20px rgba(4, 195, 252, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              Free $10k/mo+ Roadmap
            </button>
          </Link>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 glass rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </nav>
    );
  }

  // Other pages variant: simple banner with back button and home icon
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Back to Home */}
        <Link to="/">
          <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/20 hover-glow transition-all group">
            <ArrowLeft className="w-5 h-5 text-accent group-hover:transform group-hover:-translate-x-1 transition-transform" />
            <h1
              className="text-lg md:text-xl font-bold text-foreground"
              style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))" }}
            >
              The{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #04c3fc 0%, #ffffff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Deadly
              </span>{" "}
              Consultant
            </h1>
          </button>
        </Link>

        {/* Right: Home Icon */}
        <Link to="/">
          <button className="p-2 rounded-lg hover:bg-white/20 hover-glow transition-all" aria-label="Home">
            <Home className="w-5 h-5 text-accent" />
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default TopNav;
