import { Search, Home, Menu, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SignupButton from "@/components/SignupButton"; // Adjust path if needed (e.g., create the file)

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
    // Homepage variant: search on left, roadmap CTA button + new signup button
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

            {/* Mobile: Favicon Logo; Desktop: Text Title */}
            <Link to="/">
              <div className="flex items-center">
                {/* Mobile Logo */}
                <img src="/favicon.ico" alt="The Deadly Consultant Logo" className="w-8 h-8 block md:hidden" />
                {/* Desktop Text Title */}
                <h1
                  className="hidden md:block text-xl md:text-2xl font-bold text-foreground cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap"
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
              </div>
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

          {/* Right: Roadmap Button + Injected Signup Button - Responsive for mobile visibility */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/2026-bi-fintech-consulting-roadmap-pdf-unlock">
              <button
                className="px-3 py-2 text-xs md:px-6 md:py-2.5 rounded-xl font-semibold text-sm md:text-base text-white hover-glow transition-all whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, #04c3fc 0%, #0891d4 100%)",
                  boxShadow: "0 0 20px rgba(4, 195, 252, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                Free $10k/mo+ Roadmap
              </button>
            </Link>

            {/* Injected: New CTA Button with Gradient Outline & Glow - Smaller on mobile */}
            <SignupButton
              formId="fbd8fa5d1b"
              fallbackHref="https://bifintechconsulting.com/case-study-signup"
              className="px-2 py-1 text-xs md:px-6 md:py-2.5" // Smaller padding on mobile for visibility
            />
          </div>
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
