import { Search, Menu, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SignupButton from "@/components/SignupButton"; // Adjust path if needed (e.g., create the file)
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
              <div 
                className="hidden md:flex flex-col items-center bg-black/60 rounded px-3 py-1.5"
                style={{ boxShadow: "0 0 8px rgba(0, 212, 255, 0.3), 0 0 16px rgba(0, 212, 255, 0.15)" }}
              >
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
                <span className="text-[10px] text-white/70 tracking-wide">
                  AI Proof PM Consulting by Hassan Khan
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md ml-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 volumetric-glass-button rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 placeholder:text-white/60"
              />
            </div>
          </div>
        </div>

        {/* Right: Roadmap Button + Injected Signup Button - Responsive for mobile visibility */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/2026-bi-fintech-consulting-roadmap-pdf-unlock">
            <button
              className="px-3 py-2 text-xs md:px-6 md:py-2.5 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 whitespace-nowrap bg-[#DC2626] text-white hover:text-[#F4C903] border border-cyan-400/60 active:scale-95 cta-glow-pulse-red"
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

          {/* Mobile: Icon-only signup button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="md:hidden p-2 rounded-xl volumetric-glass-button"
            aria-label="Sign up"
          >
            <User className="w-6 h-6 text-white" />
          </button>

          {/* Desktop/Tablet: Full signup button */}
          <div className="hidden md:flex flex-col items-center">
            <SignupButton
              formId="fbd8fa5d1b"
              fallbackHref="https://bifintechconsulting.com/case-study-signup"
              className="px-5 py-1.5 text-base font-semibold"
            />
            <span className="text-[9px] text-white/70 tracking-wide">
              Unlock More (Free)
            </span>
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
