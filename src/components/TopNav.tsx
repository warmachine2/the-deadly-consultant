import { Search, Menu, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import SignupButton from "@/components/SignupButton";
import EmailCaptureModal from "@/components/EmailCaptureModal";
import { toast } from "@/hooks/use-toast";

interface TopNavProps {
  onSearchChange?: (query: string) => void;
  onToggleSidebar?: () => void;
}

const TopNav = ({ onSearchChange, onToggleSidebar }: TopNavProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoadmapHovered, setIsRoadmapHovered] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
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

  const handleMobileSignup = async (data: { name: string; email: string }) => {
    console.log("Form submitted:", data);
    setIsModalOpen(false);
    toast({
      title: "Success!",
      description: "Thank you for signing up. Check your email for confirmation.",
    });
    if (window.formkit?.show) {
      window.formkit.show("fbd8fa5d1b");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 volumetric-glass">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => onToggleSidebar?.()}
            className="md:hidden p-2 rounded-xl volumetric-glass-button"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          {/* Mobile: Favicon Logo; Desktop: Text Title */}
          <Link to="/">
            <div className="flex items-center">
              {/* Mobile Logo with Glass Effect */}
              <div className="md:hidden p-2 rounded-xl volumetric-glass-button mr-3">
                <img src="/favicon.ico" alt="The Deadly Consultant Logo" className="w-6 h-6 object-contain" />
              </div>
              {/* Desktop Text Title */}
              <div className="hidden md:flex flex-col items-center px-3 py-1.5">
                <h1
                  className="text-xl md:text-2xl font-bold text-white cursor-pointer transition-opacity whitespace-nowrap"
                  style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))" }}
                >
                  The{" "}
                  <span style={{ color: "#F4C903" }}>
                    Deadly
                  </span>{" "}
                  Consultant
                </h1>
                <span className="text-[8px] text-white/70 tracking-wide text-center bg-black/60 px-2 py-0.5 rounded">
                  By Hassan Khan B.Eng., PMP, AZ305
                </span>
              </div>
            </div>
          </Link>

        </div>

        {/* Right: Search + Separator + About + Roadmap + Login + Subscribe */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Desktop: Collapsible Search */}
          <div className="hidden md:flex items-center">
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

          <a href="https://thedeadlyconsultant.com/about_page/" target="_blank" rel="noopener noreferrer">
            <button
              className="px-2 py-1.5 text-xs md:px-3 md:py-2 text-sm md:text-base font-semibold text-white hover:text-[#F4C903] transition-all duration-300 whitespace-nowrap"
            >
              About
            </button>
          </a>

          <Link to="/2026-bi-fintech-consulting-roadmap-pdf-unlock">
            <button
              className="px-3 py-2 text-xs md:px-5 md:py-2 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 whitespace-nowrap bg-[#DC2626] text-white hover:text-[#F4C903] border border-cyan-400/60 active:scale-95 cta-glow-pulse-red"
              onMouseEnter={() => setIsRoadmapHovered(true)}
              onMouseLeave={() => setIsRoadmapHovered(false)}
              style={{
                boxShadow: isRoadmapHovered 
                  ? "0 0 30px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.5)" 
                  : undefined,
              }}
            >
              Free $10k/mo+ Roadmap
            </button>
          </Link>

          {/* Mobile: Icon-only buttons */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="md:hidden p-2 rounded-xl volumetric-glass-button"
            aria-label="Sign up"
          >
            <User className="w-6 h-6 text-white" />
          </button>

          {/* Desktop/Tablet: Login + Subscribe buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              className="px-4 py-1.5 text-sm font-semibold rounded-xl bg-transparent backdrop-blur-md border border-white/20 text-white hover:text-[#F4C903] hover:bg-white/10 transition-all duration-300"
            >
              Log-in
            </button>
            <SignupButton
              formId="fbd8fa5d1b"
              fallbackHref="https://bifintechconsulting.com/case-study-signup"
              className="px-4 py-1.5 text-sm font-semibold bg-[#F4C903] text-white hover:bg-[#F4C903]/90 hover:text-white border-none cta-glow-pulse-subtle"
              label="Subscribe"
            />
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-2 volumetric-glass-button rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 placeholder:text-white/60"
          />
        </div>
      </div>

      {/* Mobile Sign Up Modal */}
      <EmailCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleMobileSignup} />
    </nav>
  );
};

export default TopNav;
