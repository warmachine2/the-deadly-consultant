import { Search, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";


export const WORKSHOP_REGISTER_URL = "https://www.zerotopmconsultant.com/free-workshop";

interface TopNavProps {
  onSearchChange?: (query: string) => void;
  onToggleSidebar?: () => void;
}


const TopNav = ({ onSearchChange, onToggleSidebar }: TopNavProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 volumetric-glass">
      <div className="flex h-16 w-full items-center justify-between gap-2 px-4">
        {/* Left: Hamburger + Favicon (mobile/tablet) or Full Logo (desktop) */}
        <div className="flex min-w-0 items-center gap-2">
          {/* Mobile/Tablet: Hamburger Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 rounded-xl volumetric-glass-button flex-shrink-0"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-gray-900/95 border-r border-white/10 p-0">
              <SheetHeader className="p-4 border-b border-white/10">
                <SheetTitle className="text-white text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col py-4">
                {/* Search in mobile menu */}
                <div className="px-4 pb-4">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-3 py-2 bg-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 placeholder:text-white/60"
                    />
                  </div>
                </div>

                {/* Job Board pill */}
                <Link to="/ai-bi-fintech-pm-job-alerts-repo" className="px-4 py-3 text-white hover:text-[#F4C903] hover:bg-white/10 transition-all" onClick={closeMobileMenu}>
                  Open PM Contracts
                </Link>

                {/* Divider */}
                <div className="my-4 border-t border-white/10" />

                <div className="px-4">
                  <a href={WORKSHOP_REGISTER_URL} target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>
                    <button className="gold-glow-border w-full px-4 py-3 font-bold text-white">
                      Reserve My Free Workshop
                    </button>
                  </a>
                </div>

              </div>
            </SheetContent>
          </Sheet>

          {/* Favicon on mobile/tablet (left side) */}
          <Link to="/" className="md:hidden">
            <div className="p-2 rounded-xl volumetric-glass-button">
              <img src="/favicon.ico" alt="Zero-To-PM-Consultant Logo" className="w-6 h-6 object-contain" />
            </div>
          </Link>

          {/* Desktop Text Title (left side on desktop) */}
          <Link to="/" className="hidden md:block flex-shrink-0">
            <div className="flex flex-col items-center px-1 py-1.5">
              <h1
                className="text-base 2xl:text-xl font-bold text-white cursor-pointer transition-opacity whitespace-nowrap"
                style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))" }}
              >
                Zero-To-
                <span style={{ color: "#F4C903" }}>PM</span>
                -Consultant
              </h1>
              <span className="text-[8px] 2xl:text-[10px] text-white tracking-wide text-center bg-black/70 px-1 py-0.5 rounded mt-0.5 whitespace-nowrap">
                By Hassan Hammer B.Eng., PMP, AZ305
              </span>
            </div>
          </Link>

          {/* PM Consulting Job Board Button - Desktop */}
          <Link to="/ai-bi-fintech-pm-job-alerts-repo" className="hidden md:block flex-shrink-0">
            <button
              className="px-2 py-2 rounded-xl font-semibold text-[10px] 2xl:text-xs transition-colors duration-300 whitespace-nowrap volumetric-glass-button border-2 border-[#F4C903] text-white hover:text-[#F4C903] cta-glow-pulse"
            >
              Open PM Contracts
            </button>
          </Link>

          {/* Desktop search stays in the left group, separated from the Job Board pill */}
          <div className="hidden md:flex items-center ml-1 flex-shrink-0">
            <div className={`relative flex items-center transition-all duration-300 ${isSearchExpanded ? 'w-36' : 'w-8'}`}>
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
              </button>
              {isSearchExpanded && (
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                  className="absolute left-8 w-28 pl-2 pr-2 py-1 volumetric-glass-button rounded-lg text-xs text-white focus:outline-none placeholder:text-white/60"
                />
              )}
            </div>
          </div>
        </div>

        {/* Center: Text Logo on tablet (hidden on very small mobile and desktop) */}
        <Link to="/" className="hidden sm:block md:hidden absolute left-1/2 transform -translate-x-1/2">
          <h1
            className="text-base md:text-lg font-bold text-white cursor-pointer whitespace-nowrap"
            style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))" }}
          >
            Zero-To-
            <span style={{ color: "#F4C903" }}>PM</span>
            -Consultant
          </h1>
        </Link>

        {/* Right: Desktop Nav Items */}
        <div className="flex flex-shrink-0 items-center gap-1">



          {/* Workshop CTA - gold glowing animated border */}
          <a href={WORKSHOP_REGISTER_URL} target="_blank" rel="noopener noreferrer">
            <button
              className="gold-glow-border px-2.5 py-1.5 text-[11px] leading-tight text-center whitespace-normal font-bold text-white hover:text-[#F4C903] transition-colors duration-300 max-w-[130px] sm:max-w-none md:px-4 md:py-2.5 md:text-xs 2xl:px-5 2xl:py-3 2xl:text-sm"
            >
              Reserve My Free Workshop
            </button>
          </a>

        </div>
      </div>
    </nav>
  );
};

export default TopNav;
