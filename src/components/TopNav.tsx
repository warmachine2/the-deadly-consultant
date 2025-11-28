import { Search, Menu, User, ChevronDown, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import SignupButton from "@/components/SignupButton";
import EmailCaptureModal from "@/components/EmailCaptureModal";
import { toast } from "@/hooks/use-toast";

const tags = ["PMP Certs", "AI-Proof", "Tools", "Career Pivot", "BI Analytics", "FinTech"];
const categories = ["All Posts", "Roadmaps", "Stories", "Guides"];

interface TopNavProps {
  onSearchChange?: (query: string) => void;
  selectedTags?: string[];
  onTagToggle?: (tag: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const TopNav = ({ 
  onSearchChange, 
  selectedTags = [], 
  onTagToggle, 
  selectedCategory = "All Posts", 
  onCategoryChange 
}: TopNavProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoadmapHovered, setIsRoadmapHovered] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showTags, setShowTags] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <>
      {/* Sidebar Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={() => setIsFilterOpen(false)} />
      )}
      
      {/* Sidebar - expands downward from nav */}
      <aside
        ref={filterRef}
        className={`fixed top-16 left-0 w-72 max-h-[calc(100vh-4rem)] volumetric-glass z-[70] p-6 overflow-y-auto transition-all duration-300 origin-top ${
          isFilterOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Filters</h3>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="flex items-center justify-between w-full mb-3 text-sm font-bold text-white"
          >
            Categories
            <ChevronDown className={`w-4 h-4 transition-transform text-cyan-400 ${showCategories ? "rotate-180" : ""}`} />
          </button>
          {showCategories && (
            <div className="flex flex-col gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange?.(category)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === category ? "volumetric-glass-active" : "volumetric-glass-button text-white/80"
                  }`}
                >
                  <span style={selectedCategory === category ? { color: "#F4C903" } : {}}>
                    {category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <button
            onClick={() => setShowTags(!showTags)}
            className="flex items-center justify-between w-full mb-3 text-sm font-bold text-white"
          >
            Tags
            <ChevronDown className={`w-4 h-4 transition-transform text-cyan-400 ${showTags ? "rotate-180" : ""}`} />
          </button>
          {showTags && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagToggle?.(tag)}
                  className={`px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                    selectedTags.includes(tag) ? "volumetric-glass-active" : "volumetric-glass-button text-white/80"
                  }`}
                >
                  <span style={selectedTags.includes(tag) ? { color: "#F4C903" } : {}}>
                    {tag}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      <nav className="fixed top-0 left-0 right-0 z-50 volumetric-glass" style={{ position: 'fixed' }}>
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Left: Filter Menu + Logo + Search */}
          <div className="flex items-center gap-3 flex-1">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 rounded-xl volumetric-glass-button"
              aria-label="Toggle filters"
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
              <h1
                className="hidden md:block text-xl md:text-2xl font-bold text-foreground cursor-pointer transition-opacity whitespace-nowrap"
                style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))" }}
              >
                The{" "}
                <span style={{ color: "#F4C903" }}>
                  Deadly
                </span>{" "}
                Consultant
              </h1>
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
              className="px-3 py-2 text-xs md:px-6 md:py-2.5 rounded-xl font-semibold text-sm md:text-base transition-all whitespace-nowrap volumetric-glass-button text-white hover:text-[#F4C903] border border-white/20"
              onMouseEnter={() => setIsRoadmapHovered(true)}
              onMouseLeave={() => setIsRoadmapHovered(false)}
              style={{
                boxShadow: isRoadmapHovered 
                  ? "0 0 30px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.5)" 
                  : "0 0 20px rgba(255, 255, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3)",
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
          <div className="hidden md:block">
            <SignupButton
              formId="fbd8fa5d1b"
              fallbackHref="https://bifintechconsulting.com/case-study-signup"
              className="px-5 py-2 text-base font-semibold"
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
    </>
  );
};

export default TopNav;
