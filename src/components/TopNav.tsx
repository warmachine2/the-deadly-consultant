import { Search, Menu, User, ChevronDown, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";


interface TopNavProps {
  onSearchChange?: (query: string) => void;
  onToggleSidebar?: () => void;
}

const TopNav = ({ onSearchChange, onToggleSidebar }: TopNavProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRoadmapHovered, setIsRoadmapHovered] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [articlesOpen, setArticlesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
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
    <nav className="fixed top-0 left-0 right-0 z-50 volumetric-glass overflow-x-hidden">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6 max-w-full">
        {/* Left: Hamburger + Favicon (mobile/tablet) or Full Logo (desktop) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Mobile/Tablet: Hamburger Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="lg:hidden p-2 rounded-xl volumetric-glass-button"
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

                {/* Training Program */}
                <a
                  href="https://www.skool.com/bi-fintech-consultant-academy/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 text-white hover:text-[#F4C903] hover:bg-white/10 transition-all"
                  onClick={closeMobileMenu}
                >
                  Training Program
                </a>

                {/* Articles Collapsible */}
                <Collapsible open={articlesOpen} onOpenChange={setArticlesOpen}>
                  <CollapsibleTrigger className="w-full px-4 py-3 text-white hover:text-[#F4C903] hover:bg-white/10 transition-all flex items-center justify-between">
                    Articles
                    <ChevronDown className={`w-4 h-4 transition-transform ${articlesOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="bg-white/5">
                    <Link to="/tools-articles" className="block px-6 py-2 text-sm text-white/80 hover:text-[#F4C903] hover:bg-white/10" onClick={closeMobileMenu}>
                      Tools Articles
                    </Link>
                    <Link to="/pmp-certification-articles" className="block px-6 py-2 text-sm text-white/80 hover:text-[#F4C903] hover:bg-white/10" onClick={closeMobileMenu}>
                      PMP Cert Articles
                    </Link>
                    <Link to="/psm-certification-articles" className="block px-6 py-2 text-sm text-white/80 hover:text-[#F4C903] hover:bg-white/10" onClick={closeMobileMenu}>
                      PSM Cert Articles
                    </Link>
                    <Link to="/pmi-cpmai-certification-articles" className="block px-6 py-2 text-sm text-white/80 hover:text-[#F4C903] hover:bg-white/10" onClick={closeMobileMenu}>
                      PMI-CPMAI Cert Articles
                    </Link>
                    <Link to="/consulting-job-stories-articles" className="block px-6 py-2 text-sm text-white/80 hover:text-[#F4C903] hover:bg-white/10" onClick={closeMobileMenu}>
                      Consulting Jobs/Stories
                    </Link>
                    <Link to="/other-articles" className="block px-6 py-2 text-sm text-white/80 hover:text-[#F4C903] hover:bg-white/10" onClick={closeMobileMenu}>
                      Other Articles
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                {/* Resources Collapsible */}
                <Collapsible open={resourcesOpen} onOpenChange={setResourcesOpen}>
                  <CollapsibleTrigger className="w-full px-4 py-3 text-white hover:text-[#F4C903] hover:bg-white/10 transition-all flex items-center justify-between">
                    AI/BI-FinTech PM Resources
                    <ChevronDown className={`w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="bg-white/5">
                    <Link to="/3ks-tracker" className="block px-6 py-2 text-sm text-white/80 hover:text-[#F4C903] hover:bg-white/10" onClick={closeMobileMenu}>
                      3KS Productivity Tracker
                    </Link>
                    <Link to="/2026-bi-fintech-consulting-roadmap-pdf-unlock" className="block px-6 py-2 text-sm text-white/80 hover:text-[#F4C903] hover:bg-white/10" onClick={closeMobileMenu}>
                      90D PM Pivot Roadmap
                    </Link>
                    <Link to="/pm-strategy-guide-pdf" className="block px-6 py-2 text-sm text-white/80 hover:text-[#F4C903] hover:bg-white/10" onClick={closeMobileMenu}>
                      PM Strategy Guide PDF
                    </Link>
                    <Link to="/ai-bi-fintech-pm-job-alerts-repo" className="block px-6 py-2 text-sm text-white/80 hover:text-[#F4C903] hover:bg-white/10" onClick={closeMobileMenu}>
                      Job Alerts/Repo
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                {/* Book Strategy Session */}
                <Link to="/book-session" className="px-4 py-3 text-white hover:text-[#F4C903] hover:bg-white/10 transition-all" onClick={closeMobileMenu}>
                  Book Strategy Session
                </Link>

                {/* About */}
                <Link to="/about-post" className="px-4 py-3 text-white hover:text-[#F4C903] hover:bg-white/10 transition-all" onClick={closeMobileMenu}>
                  About
                </Link>

                {/* Divider */}
                <div className="my-4 border-t border-white/10" />

                {/* CTA buttons in mobile menu */}
                <div className="px-4 space-y-3">
                  <Link to="/2026-bi-fintech-consulting-roadmap-pdf-unlock" onClick={closeMobileMenu}>
                    <button className="w-full px-4 py-3 rounded-xl font-semibold bg-[#DC2626] text-white hover:text-[#F4C903] border border-cyan-400/60">
                      Free $10k/mo+ Roadmap
                    </button>
                  </Link>
                  <button className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-transparent border border-white/20 text-white hover:text-[#F4C903] hover:bg-white/10">
                    Log-in
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Favicon on mobile/tablet (left side) */}
          <Link to="/" className="lg:hidden">
            <div className="p-2 rounded-xl volumetric-glass-button">
              <img src="/favicon.ico" alt="ZeroToPMConsultant.com Logo" className="w-6 h-6 object-contain" />
            </div>
          </Link>

          {/* Desktop Text Title (left side on desktop) */}
          <Link to="/" className="hidden lg:block">
            <div className="flex flex-col items-center px-3 py-1.5">
              <h1
                className="text-xl lg:text-2xl font-bold text-white cursor-pointer transition-opacity whitespace-nowrap"
                style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))" }}
              >
                Zero-To-
                <span style={{ color: "#F4C903" }}>PM</span>
                -Consultant
              </h1>
              <span className="text-[8px] text-white/70 tracking-wide text-center bg-black/60 px-2 py-0.5 rounded">
                By Hassan Hammer B.Eng., PMP, CPMAI
              </span>
            </div>
          </Link>

          {/* PM Consulting Job Board Button - Desktop */}
          <Link to="/ai-bi-fintech-pm-job-alerts-repo" className="hidden lg:block">
            <button
              className="px-4 py-2 rounded-xl font-semibold text-sm transition-colors duration-300 whitespace-nowrap volumetric-glass-button border-2 border-[#F4C903] text-white hover:text-[#F4C903] cta-glow-pulse"
            >
              PM CONSULTING JOB BOARD
            </button>
          </Link>
        </div>

        {/* Center: Text Logo on tablet (hidden on very small mobile and desktop) */}
        <Link to="/" className="hidden sm:block lg:hidden absolute left-1/2 transform -translate-x-1/2">
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
        <div className="flex items-center gap-1 lg:gap-3">
          {/* Desktop: Collapsible Search */}
          <div className="hidden lg:flex items-center">
            <div className={`relative flex items-center transition-all duration-300 ${isSearchExpanded ? 'w-40' : 'w-8'}`}>
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
                  className="absolute left-8 w-32 pl-2 pr-2 py-1 volumetric-glass-button rounded-lg text-xs text-white focus:outline-none placeholder:text-white/60"
                />
              )}
            </div>
            
            {/* Separator */}
            <span className="text-white/40 mx-2">|</span>
          </div>

          {/* Desktop Nav Links - Hidden on mobile/tablet */}
          <a
            href="https://www.skool.com/bi-fintech-consultant-academy/about"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:block px-3 py-2 text-sm font-semibold text-white hover:text-[#F4C903] transition-all duration-300 whitespace-nowrap"
          >
            Training Program
          </a>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="hidden lg:flex px-3 py-2 text-sm font-semibold text-white hover:text-[#F4C903] transition-all duration-300 whitespace-nowrap items-center gap-1"
              >
                Articles
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 border border-white/20 min-w-[200px] z-[100]">
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white hover:text-[#F4C903] focus:text-[#F4C903]">
                <Link to="/tools-articles" className="w-full">
                  Tools Articles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white hover:text-[#F4C903] focus:text-[#F4C903]">
                <Link to="/pmp-certification-articles" className="w-full">
                  PMP Cert Articles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white hover:text-[#F4C903] focus:text-[#F4C903]">
                <Link to="/psm-certification-articles" className="w-full">
                  PSM Cert Articles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white hover:text-[#F4C903] focus:text-[#F4C903]">
                <Link to="/pmi-cpmai-certification-articles" className="w-full">
                  PMI-CPMAI Cert Articles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white hover:text-[#F4C903] focus:text-[#F4C903]">
                <Link to="/consulting-job-stories-articles" className="w-full">
                  Consulting Jobs/Stories Articles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white hover:text-[#F4C903] focus:text-[#F4C903]">
                <Link to="/other-articles" className="w-full">
                  Other Articles
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="hidden lg:flex px-3 py-2 text-sm font-semibold text-white hover:text-[#F4C903] transition-all duration-300 whitespace-nowrap items-center gap-1"
              >
                AI/BI-FinTech PM Resources
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 border border-white/20 min-w-[200px] z-[100]">
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white hover:text-[#F4C903] focus:text-[#F4C903]">
                <Link to="/3ks-tracker" className="w-full">
                  3KS Productivity Tracker
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white hover:text-[#F4C903] focus:text-[#F4C903]">
                <Link to="/2026-bi-fintech-consulting-roadmap-pdf-unlock" className="w-full">
                  90D PM Pivot Roadmap
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white hover:text-[#F4C903] focus:text-[#F4C903]">
                <Link to="/pm-strategy-guide-pdf" className="w-full">
                  PM Consulting Strategy Guide PDF
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white hover:text-[#F4C903] focus:text-[#F4C903]">
                <Link to="/ai-bi-fintech-pm-job-alerts-repo" className="w-full">
                  AI/BI-FinTech PM Job Alerts/Repo
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/book-session" className="hidden lg:block">
            <button
              className="px-3 py-2 text-sm font-semibold text-white hover:text-[#F4C903] transition-all duration-300 whitespace-nowrap"
            >
              Book Session
            </button>
          </Link>

          <Link to="/about-post" className="hidden lg:block">
            <button
              className="px-3 py-2 text-sm font-semibold text-white hover:text-[#F4C903] transition-all duration-300 whitespace-nowrap"
            >
              About
            </button>
          </Link>

          {/* CTA Button - visible on all screens but smaller on mobile */}
          <Link to="/2026-bi-fintech-consulting-roadmap-pdf-unlock">
            <button
              className="px-2 py-1.5 text-[10px] lg:px-5 lg:py-2 rounded-xl font-semibold lg:text-sm transition-all duration-300 whitespace-nowrap bg-[#DC2626] text-white hover:text-[#F4C903] border border-cyan-400/60 active:scale-95 cta-glow-pulse-red"
              onMouseEnter={() => setIsRoadmapHovered(true)}
              onMouseLeave={() => setIsRoadmapHovered(false)}
              style={{
                boxShadow: isRoadmapHovered 
                  ? "0 0 30px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.5)" 
                  : undefined,
              }}
            >
              <span className="hidden sm:inline">Free $10k/mo+ Roadmap</span>
              <span className="sm:hidden">Free Roadmap</span>
            </button>
          </Link>

          {/* Desktop: Login + Subscribe buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              className="px-4 py-1.5 text-sm font-semibold rounded-xl bg-transparent backdrop-blur-md border border-white/20 text-white hover:text-[#F4C903] hover:bg-white/10 transition-all duration-300"
            >
              Log-in
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
